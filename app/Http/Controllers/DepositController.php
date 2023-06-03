<?php

namespace App\Http\Controllers;

use App\Models\DepositHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $query = DepositHistory::with(['customer', 'account'])
            ->where('credit', 0)
            ->orderBy('is_valid', 'desc')
            ->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where(function ($query) use ($request) {
                $query->where('description', 'like', "%$request->q%")
                    ->orWhereHas('customer', function ($query) use ($request) {
                        $query->where('fullname', 'like', "%$request->q%")
                            ->orWhere('email', 'like', "%$request->q%")
                            ->orWhere('phone', 'like', "%$request->q%");
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

    public function update(Request $request, DepositHistory $deposit)
    {
        $request->validate([
            'status' => [
                'required',
                Rule::in([DepositHistory::STATUS_VALID, DepositHistory::STATUS_REJECT]),
            ],
        ]);

        DB::beginTransaction();
        $deposit->update([
            'is_valid' => $request->status,
        ]);
        if ($request->status == DepositHistory::STATUS_VALID) {
            $deposit->update_customer_balance();
        }
        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
