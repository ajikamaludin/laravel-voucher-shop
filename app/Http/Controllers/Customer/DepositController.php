<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\DepositHistory;
use App\Models\DepositLocation;
use App\Models\Setting;
use App\Services\GeneralService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $histories = DepositHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->orderBy('is_valid', 'desc')
            ->where('type', DepositHistory::TYPE_DEPOSIT);

        $start_date = now()->startOfMonth();
        $end_date = now()->endOfMonth();
        if ($request->startDate != '' && $request->endDate != '') {
            $start_date = Carbon::parse($request->startDate);
            $end_date = Carbon::parse($request->endDate);
        }

        $histories->whereBetween('created_at', [$start_date, $end_date]);

        return inertia('Deposit/Index', [
            'histories' => $histories->paginate(20),
            '_start_date' => $start_date->format('m/d/Y'),
            '_end_date' => $end_date->format('m/d/Y'),
        ]);
    }

    public function create(Request $request)
    {
        $customer = $request->user('customer');
        if (! $customer->allow_transaction) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'akun anda dibekukan tidak dapat melakukan transaksi']);
        }

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
                Rule::in([Setting::PAYMENT_MANUAL, Setting::PAYMENT_MIDTRANS, Setting::PAYMENT_CASH_DEPOSIT]),
            ],
        ]);

        DB::beginTransaction();
        $deposit = DepositHistory::make([
            'customer_id' => auth()->id(),
            'debit' => $request->amount,
            'payment_channel' => $request->payment,
            'type' => DepositHistory::TYPE_DEPOSIT,
        ]);

        if (in_array($request->payment, [Setting::PAYMENT_MANUAL, Setting::PAYMENT_CASH_DEPOSIT])) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_UPLOAD;
            $deposit->save();
        }

        if ($request->payment == Setting::PAYMENT_MIDTRANS) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_PAYMENT;
            $deposit->save();

            $token = (new MidtransService($deposit, Setting::getByKey('MIDTRANS_SERVER_KEY')))->getSnapToken();

            $deposit->update(['payment_token' => $token]);
        }

        $deposit->create_notification();

        DB::commit();

        return redirect()->route('transactions.deposit.show', ['deposit' => $deposit->id, 'direct' => 'true']);
    }

    public function show(Request $request, DepositHistory $deposit)
    {
        return inertia('Deposit/Detail', [
            'deposit' => $deposit->load(['account', 'depositLocation']),
            'accounts' => Account::get(),
            'deposit_locations' => DepositLocation::get(),
            'midtrans_client_key' => Setting::getByKey('MIDTRANS_CLIENT_KEY'),
            'is_production' => app()->isProduction(),
            'direct' => $request->direct,
            'bank_admin_fee' => Setting::getByKey('ADMINFEE_MANUAL_TRANSFER'),
            'cash_admin_fee' => Setting::getByKey('ADMINFEE_CASH_DEPOSIT'),
            'back' => $request->back ?? 'transactions.deposit.index',
        ]);
    }

    public function update(Request $request, DepositHistory $deposit)
    {
        $request->validate([
            'image' => 'required|image',
        ]);

        if ($deposit->payment_channel == Setting::PAYMENT_CASH_DEPOSIT) {
            $request->validate(['deposit_location_id' => 'required|exists:deposit_locations,id']);
        }

        if ($deposit->payment_channel == Setting::PAYMENT_MANUAL) {
            $request->validate(['account_id' => 'required|exists:accounts,id']);
        }

        $file = $request->file('image');
        $file->store('uploads', 'public');

        $deposit->update([
            'image_prove' => $file->hashName('uploads'),
            'account_id' => $request->account_id,
            'deposit_location_id' => $request->deposit_location_id,
            'is_valid' => DepositHistory::STATUS_WAIT_APPROVE,
        ]);

        $deposit->create_notification();
        $deposit->create_notification_repayment();

        session()->flash('message', ['type' => 'success', 'message' => 'Upload berhasil, silahkan tunggu untuk approve']);
    }

    public function midtrans_payment(Request $request, DepositHistory $deposit)
    {
        DB::beginTransaction();

        $transaction_status = $request->result['transaction_status'];
        if ($transaction_status == 'settlement' || $transaction_status == 'capture') {
            $is_valid = DepositHistory::STATUS_VALID;
        } elseif ($transaction_status == 'pending') {
            $is_valid = DepositHistory::STATUS_WAIT_PAYMENT;
        } else {
            $is_valid = DepositHistory::STATUS_INVALID;
        }

        if ($deposit->is_valid == DepositHistory::STATUS_VALID) {
            return redirect()->route('transactions.deposit.show', ['deposit' => $deposit->id]);
        }

        $deposit->update([
            'is_valid' => $is_valid,
            'payment_response' => json_encode($request->result),
            'payment_type' => $request->result['payment_type'],
        ]);

        if ($is_valid == DepositHistory::STATUS_VALID) {
            if ($deposit->type == DepositHistory::TYPE_REPAYMENT) {
                $paylater = $deposit->paylater;
                $paylater->update([
                    'credit' => $deposit->debit,
                    'is_valid' => $deposit->is_valid,
                ]);
                $paylater->update_customer_paylater();
            }

            if ($deposit->type == DepositHistory::TYPE_DEPOSIT) {
                $deposit->update_customer_balance();
            }
        }

        DB::commit();

        return redirect()->route('transactions.deposit.show', ['deposit' => $deposit->id]);
    }

    public function mindtrans_notification(Request $request)
    {
        info('mindtrans_notification', ['request boyd' => $request->input()]);

        DB::beginTransaction();
        $deposit = DepositHistory::where('id', $request->order_id)->first();

        if ($deposit != null && $deposit->is_valid != DepositHistory::STATUS_VALID) {
            $deposit->fill([
                'payment_response' => json_encode($request->all()),
                'payment_type' => $request->payment_type,
            ]);

            if ($request->transaction_status == 'settlement' || $request->transaction_status == 'capture') {
                $deposit->fill(['is_valid' => DepositHistory::STATUS_VALID]);

                if ($deposit->type == DepositHistory::TYPE_REPAYMENT) {
                    $paylater = $deposit->paylater;
                    $paylater->update([
                        'credit' => $deposit->debit,
                        'is_valid' => $deposit->is_valid,
                    ]);
                    $paylater->update_customer_paylater();
                }

                if ($deposit->type == DepositHistory::TYPE_DEPOSIT) {
                    $deposit->update_customer_balance();
                    $deposit->create_notification();
                    $deposit->create_notification_user();
                }
            } elseif ($request->transaction_status == 'pending') {
                $deposit->fill(['is_valid' => DepositHistory::STATUS_WAIT_PAYMENT]);
            } else {
                $deposit->fill(['is_valid' => DepositHistory::STATUS_INVALID]);
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
