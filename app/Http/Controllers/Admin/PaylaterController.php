<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\PaylaterHistory;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaylaterController extends Controller
{
    public function index()
    {
        // TODO show list of paylater repaymeny
    }

    public function edit()
    {
        // TODO show detail repayment and confirmation
    }

    public function update()
    {
        // TODO store update detail of repayment
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

        $customer->paylater->update([
            'day_deadline' => $request->day_deadline,
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
