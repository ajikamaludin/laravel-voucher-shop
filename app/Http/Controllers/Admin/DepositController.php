<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\PaylaterHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $deposits = DepositHistory::with(['customer', 'account', 'depositLocation', 'editor'])
            ->where('credit', 0);

        if ($request->q != '') {
            $deposits->where(function ($query) use ($request) {
                $query->where('description', 'ilike', "%$request->q%")
                    ->orWhereHas('customer', function ($query) use ($request) {
                        $query->where('fullname', 'ilike', "%$request->q%")
                            ->orWhere('email', 'ilike', "%$request->q%")
                            ->orWhere('phone', 'ilike', "%$request->q%");
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

        if ($request->customer_id != '') {
            $deposits->where('is_valid', $request->customer_id);
        }

        $customers = Customer::with(['paylater'])->orderBy('deposit_balance', 'desc');

        $stats = [
            'deposit_this_month' => DepositHistory::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('is_valid', DepositHistory::STATUS_VALID)
                ->sum('debit'),
            'deposit_today' => DepositHistory::whereDate('created_at', now())
                ->where('is_valid', DepositHistory::STATUS_VALID)
                ->sum('debit'),
            'paylater_this_month' => PaylaterHistory::whereMonth('created_at', now()->month)
                ->where('is_valid', PaylaterHistory::STATUS_VALID)
                ->whereYear('created_at', now()->year)
                ->sum('debit'),
            'paylater_today' => PaylaterHistory::whereDate('created_at', now())
                ->where('is_valid', PaylaterHistory::STATUS_VALID)
                ->sum('debit'),
        ];

        return inertia('DepositHistory/Index', [
            'deposits' => $deposits->paginate(),
            '_q' => $request->q,
            '_sortBy' => $sortBy,
            '_sortRule' => $sortRule,
            'customers' => $customers->paginate(10, '*', 'customer_page'),
            'stats' => $stats,
        ]);
    }

    public function edit(DepositHistory $deposit)
    {
        return inertia('DepositHistory/Form', [
            'deposit' => $deposit->load(['customer', 'account', 'depositLocation', 'editor']),
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

        if ($request->status == DepositHistory::STATUS_REJECT) {
            $request->validate(['reject_reason' => 'required|string']);
        }

        DB::beginTransaction();
        $deposit->update([
            'debit' => $request->debit,
            'is_valid' => $request->is_valid,
            'note' => $request->reject_reason,
        ]);

        if ($request->status == DepositHistory::STATUS_VALID) {
            $deposit->update_customer_balance();
            $deposit->create_notification_user();
        }
        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
