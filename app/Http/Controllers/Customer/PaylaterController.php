<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\DepositHistory;
use App\Models\PaylaterHistory;
use App\Models\Setting;
use App\Services\GeneralService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaylaterController extends Controller
{
    public function index()
    {
        $histories = PaylaterHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc');

        return inertia('Paylater/Index', [
            'histories' => $histories->paginate(20),
        ]);
    }

    public function show(Request $request, PaylaterHistory $paylater)
    {
        if ($paylater->type == PaylaterHistory::TYPE_REPAYMENT) {
            $deposit = DepositHistory::where('related_id', $paylater->id)->first();

            if (! in_array($deposit->is_valid, [DepositHistory::STATUS_VALID])) {
                return redirect()->route('transactions.deposit.show', [
                    'deposit' => $deposit,
                    'back' => 'customer.paylater.index',
                ]);
            }
        }

        return inertia('Paylater/Detail', [
            'paylater' => $paylater,
        ]);
    }

    public function create(Request $request)
    {
        return inertia('Paylater/Repay', [
            'amount' => $request->user('customer')->paylater->usage,
            'payments' => GeneralService::getEnablePayment(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
            'payment' => [
                'required',
                Rule::in([Setting::PAYMENT_MANUAL, Setting::PAYMENT_MIDTRANS, Setting::PAYMENT_CASH_DEPOSIT]),
            ],
        ]);

        $customer = $request->user('customer');

        // validate amount
        if ($customer->paylater->usage < $request->amount) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Nominal Tagihan tidak boleh lebih dari tagihan']);
        }

        // alasan pembayaran tidak full
        if ($customer->paylater->usage != $request->amount) {
            $request->validate([
                'not_fullpayment_reason' => 'required|string',
                'next_payment' => 'required|date',
            ]);
        }

        // only 1 repayment at a time
        $repayment = DepositHistory::query()
            ->where([
                ['customer_id', '=', $customer->id],
                ['type', '=', DepositHistory::TYPE_REPAYMENT],
            ])->where(function ($query) {
                $query->where('is_valid', '!=', DepositHistory::STATUS_VALID)
                    ->where('is_valid', '!=', DepositHistory::STATUS_REJECT)
                    ->where('is_valid', '!=', DepositHistory::STATUS_EXPIRED);
            })->first();
        if ($repayment != null) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Selesaikan pembayaran tagihan sebelumnya']);
        }

        DB::beginTransaction();
        $code = GeneralService::generateDepositRepayCode();

        $paylater = $customer->paylaterHistories()->create([
            'credit' => $request->amount,
            'description' => $code,
            'not_fullpayment_reason' => $request->not_fullpayment_reason,
            'next_payment' => $request->next_payment,
            'type' => PaylaterHistory::TYPE_REPAYMENT,
        ]);

        $deposit = DepositHistory::make([
            'description' => $code,
            'related_type' => PaylaterHistory::class,
            'related_id' => $paylater->id,
            'customer_id' => $customer->id,
            'debit' => $request->amount,
            'payment_channel' => $request->payment,
            'type' => DepositHistory::TYPE_REPAYMENT,
        ]);

        if (in_array($request->payment, [Setting::PAYMENT_MANUAL, Setting::PAYMENT_CASH_DEPOSIT])) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_UPLOAD;
            $paylater->is_valid = PaylaterHistory::STATUS_WAIT_UPLOAD;

            $deposit->save();
        }

        if ($request->payment == Setting::PAYMENT_MIDTRANS) {
            $deposit->is_valid = DepositHistory::STATUS_WAIT_PAYMENT;
            $paylater->is_valid = PaylaterHistory::STATUS_WAIT_PAYMENT;

            $deposit->save();

            $token = (new MidtransService($deposit, Setting::getByKey('MIDTRANS_SERVER_KEY')))->getSnapToken();

            $deposit->update(['payment_token' => $token]);
        }

        $deposit->create_notification_repayment();

        $paylater->save();

        DB::commit();

        return redirect()->route('transactions.deposit.show', [
            'deposit' => $deposit->id,
            'direct' => 'true',
            'back' => 'customer.paylater.index',
        ]);
    }
}
