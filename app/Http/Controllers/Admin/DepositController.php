<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepositHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $query = DepositHistory::with(['customer', 'account', 'depositLocation', 'editor'])
            ->where('credit', 0)
            ->orderBy('is_valid', 'desc')
            ->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where(function ($query) use ($request) {
                $query->where('description', 'ilike', "%$request->q%")
                    ->orWhereHas('customer', function ($query) use ($request) {
                        $query->where('fullname', 'ilike', "%$request->q%")
                            ->orWhere('email', 'ilike', "%$request->q%")
                            ->orWhere('phone', 'ilike', "%$request->q%");
                    });
            });
        }

        if ($request->status != '') {
            $query->where('is_valid', $request->status);
        }

        if ($request->customer_id != '') {
            $query->where('is_valid', $request->customer_id);
        }

        return inertia('DepositHistory/Index', [
            'query' => $query->paginate(),
        ]);
    }

    // TODO: ubah deposit confirm menggunakan page form
    public function edit(DepositHistory $deposit)
    {
    }

    public function update(Request $request, DepositHistory $deposit)
    {
        $request->validate([
            'status' => [
                'required',
                Rule::in([DepositHistory::STATUS_VALID, DepositHistory::STATUS_REJECT]),
            ],
        ]);

        if ($request->status == DepositHistory::STATUS_REJECT) {
            $request->validate(['reject_reason' => 'required|string']);
        }

        DB::beginTransaction();
        $deposit->update([
            'is_valid' => $request->status,
            'note' => $request->reject_reason
        ]);
        if ($request->status == DepositHistory::STATUS_VALID) {
            $deposit->update_customer_balance();

            $customer = Customer::find($deposit->customer_id);
            $customer->repayPaylater($deposit);
            $deposit->create_notification_user();
        }
        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
