<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\PaylaterHistory;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaylaterController extends Controller
{
    public function index(Request $request)
    {
        $deposits = DepositHistory::with(['customer', 'account', 'depositLocation', 'editor'])
            ->where('credit', 0)
            ->where('type', DepositHistory::TYPE_REPAYMENT);

        if ($request->q != '') {
            $deposits->where(function ($query) use ($request) {
                $query->where('description', 'like', "%$request->q%")
                    ->orWhereHas('customer', function ($query) use ($request) {
                        $query->where('fullname', 'like', "%$request->q%")
                            ->orWhere('email', 'like', "%$request->q%")
                            ->orWhere('phone', 'like', "%$request->q%");
                    });
            });
        }

        $sortBy = 'updated_at';
        $sortRule = 'desc';
        if ($request->sortBy != '' && $request->sortRule != '') {
            $sortBy = $request->sortBy;
            $sortRule = $request->sortRule;
        }

        $deposits->orderBy($sortBy, $sortRule);

        if ($request->status != '') {
            $deposits->where('is_valid', $request->status);
        }

        return inertia('Paylater/Index', [
            'deposits' => $deposits->paginate(),
            '_q' => $request->q,
            '_sortBy' => $sortBy,
            '_sortRule' => $sortRule,
        ]);
    }

    public function show(PaylaterHistory $paylater)
    {
        $deposit = DepositHistory::where('related_id', $paylater->id)->first();

        return inertia('Paylater/Detail', [
            'paylater' => $paylater->load(['customer']),
            'deposit' => $deposit->load(['customer', 'account', 'depositLocation', 'editor', 'paylater']),
        ]);
    }

    public function edit(DepositHistory $deposit)
    {
        return inertia('Paylater/Form', [
            'deposit' => $deposit->load(['customer', 'account', 'depositLocation', 'paylater', 'editor']),
        ]);
    }

    public function update(Request $request, DepositHistory $deposit)
    {
        $request->validate([
            'is_valid' => [
                'required',
                Rule::in([DepositHistory::STATUS_VALID, DepositHistory::STATUS_REJECT]),
            ],
            'debit' => 'required|numeric',
        ]);

        if ($request->is_valid == DepositHistory::STATUS_REJECT) {
            $request->validate(['reject_reason' => 'required|string']);
        }

        DB::beginTransaction();
        $deposit->update([
            'debit' => $request->debit,
            'is_valid' => $request->is_valid,
            'note' => $request->reject_reason,
        ]);

        $paylater = $deposit->paylater;
        $paylater->update([
            'credit' => $request->debit,
            'is_valid' => $request->is_valid,
        ]);

        if ($request->is_valid == DepositHistory::STATUS_VALID) {
            $paylater->update_customer_paylater();
            $paylater->create_notification_user();
        }

        DB::commit();

        return redirect()->route('paylater.repay.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function limit()
    {
        return inertia('Paylater/FormLimit');
    }

    public function updateLimit(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'limit' => 'required|numeric',
            'description' => 'required|string',
        ]);

        DB::beginTransaction();
        $customer = Customer::find($request->customer_id);

        $customer->paylater->update([
            'limit' => $customer->paylater->limit + $request->limit,
        ]);

        $customer->paylaterHistories()->create([
            'credit' => $request->limit,
            'description' => GeneralService::generatePaylaterTopupCode(),
            'note' => $request->description,
            'type' => PaylaterHistory::TYPE_UPGRADE,
        ]);

        DB::commit();

        return redirect()->route('mitra.history.paylater_limit', $customer)
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function tenor()
    {
        return inertia('Paylater/FormTenor');
    }

    public function updateTenor(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'day_deadline' => 'required|numeric|max:365',
            'file_agreement' => 'required|file',
        ]);

        $file = $request->file('file_agreement');
        $file->store('uploads', 'public');
        $fileAgreement = $file->hashName('uploads');

        DB::beginTransaction();
        $customer = Customer::find($request->customer_id);

        $paylater = $customer->paylater;
        if ($paylater->day_deadline_at != null) {
            $paylater->day_deadline_at = Carbon::parse($paylater->day_deadline_at)
                ->addDays($request->day_deadline - $paylater->day_deadline);
        }

        $paylater->update([
            'day_deadline' => $request->day_deadline,
            'day_deadline_at' => $paylater->day_deadline_at,
        ]);

        $customer->partner()->updateOrCreate([
            'customer_id' => $customer->id,
        ], [
            'file_agreement' => $fileAgreement,
        ]);

        $customer->paylaterTenorHistories()->create([
            'day_deadline' => $request->day_deadline,
            'file_agreement' => $fileAgreement,
            'description' => '',
        ]);

        DB::commit();

        return redirect()->route('mitra.history.paylater_deadline', $customer)
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }
}
