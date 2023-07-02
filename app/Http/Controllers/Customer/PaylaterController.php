<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
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

        DB::beginTransaction();
        $code = GeneralService::generateDepositRepayCode();

        $paylater = $customer->paylaterHistories()->create([
            'credit' => $request->amount,
            'description' => $code,
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

        $paylater->save();

        DB::commit();

        return redirect()->route('transactions.deposit.show', ['deposit' => $deposit->id, 'direct' => 'true']);
    }
}
