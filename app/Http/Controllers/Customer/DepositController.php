<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\DepositHistory;
use App\Models\Setting;
use App\Services\GeneralService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DepositController extends Controller
{
    public function index()
    {
        $histories = DepositHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->orderBy('is_valid', 'desc');

        return inertia('Deposit/Index', [
            'histories' => $histories->paginate(20),
        ]);
    }

    public function create()
    {
        return inertia('Deposit/Topup', [
            'payments' => GeneralService::getEnablePayment(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'payment' => [
                'required',
                Rule::in([Setting::PAYMENT_MANUAL, Setting::PAYMENT_MIDTRANS]),
            ],
        ]);

        DB::beginTransaction();
        $deposit = DepositHistory::make([
            'customer_id' => auth()->id(),
            'debit' => $request->amount,
            'description' => 'Top Up #' . Str::random(5),
            'payment_channel' => $request->payment,
        ]);

        if ($request->payment == Setting::PAYMENT_MANUAL) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_UPLOAD;
            $deposit->save();
        }

        if ($request->payment == Setting::PAYMENT_MIDTRANS) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_PAYMENT;
            $deposit->save();

            $token = (new MidtransService($deposit, Setting::getByKey('MIDTRANS_SERVER_KEY')))->getSnapToken();

            $deposit->update(['payment_token' => $token]);
        }

        DB::commit();

        return redirect()->route('customer.deposit.show', ['deposit' => $deposit->id, 'direct' => 'true']);
    }

    public function show(Request $request, DepositHistory $deposit)
    {
        return inertia('Deposit/Detail', [
            'deposit' => $deposit,
            'accounts' => Account::get(),
            'midtrans_client_key' => Setting::getByKey('MIDTRANS_CLIENT_KEY'),
            'is_production' => app()->isProduction(),
            'direct' => $request->direct,
        ]);
    }

    public function update(Request $request, DepositHistory $deposit)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'image' => 'required|image',
        ]);

        $file = $request->file('image');
        $file->store('uploads', 'public');
        $deposit->update([
            'image_prove' => $file->hashName('uploads'),
            'account_id' => $request->account_id,
            'is_valid' => DepositHistory::STATUS_WAIT_APPROVE,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Upload berhasil, silahkan tunggu untuk approve']);
    }

    public function midtrans_payment(Request $request, DepositHistory $deposit)
    {
        DB::beginTransaction();
        $transaction_status = $request->result['transaction_status'];
        if ($transaction_status == 'settlement' || $transaction_status == 'capture') {
            $is_valid = DepositHistory::STATUS_VALID;
            $deposit->update_customer_balance();
        } elseif ($transaction_status == 'pending') {
            $is_valid = DepositHistory::STATUS_WAIT_PAYMENT;
        } else {
            $is_valid = DepositHistory::STATUS_INVALID;
        }
        $deposit->update([
            'is_valid' => $is_valid,
            'payment_response' => json_encode($request->result),
            'payment_type' => $request->result['payment_type'],
        ]);

        DB::commit();

        return redirect()->route('customer.deposit.show', ['deposit' => $deposit->id]);
    }

    public function mindtrans_notification(Request $request)
    {
        DB::beginTransaction();
        $deposit = DepositHistory::where('id', $request->order_id)->first();

        if ($deposit != null && $deposit->is_valid != DepositHistory::STATUS_VALID) {
            $deposit->fill([
                'payment_response' => json_encode($request->all()),
                'payment_type' => $request->result['payment_type'],
            ]);

            if ($request->transaction_status == 'settlement' || $request->transaction_status == 'capture') {
                $deposit->fill(['payment_status' => DepositHistory::STATUS_VALID]);
                $deposit->update_customer_balance();
            } elseif ($request->transaction_status == 'pending') {
                $deposit->fill(['payment_status' => DepositHistory::STATUS_WAIT_PAYMENT]);
            } else {
                $deposit->fill(['payment_status' => DepositHistory::STATUS_INVALID]);
            }

            $deposit->save();
        }

        DB::commit();

        return response()->json([
            'status' => 'ok',
            'order' => $deposit,
        ]);
    }
}