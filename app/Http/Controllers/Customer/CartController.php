<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\PoinReward;
use App\Models\Sale;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CartController extends Controller
{
    /**
     * show list of item in cart
     * has payed button
     * show payment method -> deposit, poin, paylater
     */
    public function index(Request $request)
    {
        $customer = $request->user('customer');
        $carts = $customer->carts->load(['voucher.locationProfile.location']);
        $total = $carts->sum(function ($item) {
            return $item->quantity * $item->voucher->validate_price;
        });

        $checkAllowProcess = [
            $customer->deposit_balance >= $total,
            $customer->paylater_remain >= $total
        ];

        $allowProcess = in_array(true, $checkAllowProcess);

        return inertia('Cart/Index', [
            'carts' => $carts,
            'total' => $total,
            'allow_process' => $allowProcess,
            'payments' => GeneralService::getCartEnablePayment($customer, $total),
        ]);
    }

    /**
     * handle cart add, remove or sub
     */
    public function store(Request $request, Voucher $voucher)
    {
        $operator = $request->param ?? 'add'; //delete, sub, add
        $customer = $request->user('customer');

        $item = $customer->carts()->where(['entity_id' => $voucher->id])->first();
        if ($item !== null) {
            if ($operator == 'delete') {
                $item->delete();
                session()->flash('message', ['type' => 'success', 'message' => 'voucher dihapus dari keranjang', 'cart' => 1]);
            }
            if ($operator == 'add') {
                // bisa tambah filter stock vouchernya
                $item->update([
                    'quantity' => $item->quantity + 1
                ]);
            }
            if ($operator == 'sub') {
                if ($item->quantity - 1 != 0) {
                    $item->update([
                        'quantity' => $item->quantity - 1
                    ]);
                }
            }
        } else {
            $customer->carts()->create([
                'entity_id' => $voucher->id,
                'quantity' => 1
            ]);

            session()->flash('message', ['type' => 'success', 'message' => 'voucher ditambahkan ke keranjang', 'cart' => 1]);
        }

        if ($request->direct != '') {
            return redirect()->route('cart.index');
        }
    }

    /**
     * find correct voucher , reject if cant be found
     * create sale and item sale
     * credit deposit
     * redirect to show detail
     */
    public function purchase(Request $request)
    {
        $request->validate([
            'payed_with' => [
                'required',
                Rule::in([Sale::PAYED_WITH_DEPOSIT, Sale::PAYED_WITH_PAYLATER]),
            ],
        ]);

        DB::beginTransaction();
        $customer = $request->user('customer');
        $carts = $customer->carts->load(['voucher.locationProfile.location']);

        // validate carts not empty
        if ($carts->count() == 0) {
            return redirect()->route('home.index')
                ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, keranjang anda kosong']);
        }

        // validate voucher is available
        foreach ($carts as $item) {
            $batchCount = $item->voucher->count_unsold();
            if ($batchCount < $item->quantity) {
                $customer->carts()->delete();

                return redirect()->route('home.index')
                    ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, voucher sedang tidak tersedia']);
            }
        }

        // calculate total
        $total = $carts->sum(function ($item) {
            return $item->quantity * $item->voucher->validate_price;
        });

        // create sale
        $sale = $customer->sales()->create([
            'date_time' => now(),
            'amount' => $total,
            'payed_with' => $request->payed_with,
        ]);

        // create sale item by per voucher
        foreach ($carts as $item) {
            $vouchers = $item->voucher->shuffle_unsold($item->quantity);
            foreach ($vouchers as $voucher) {
                $sale->items()->create([
                    'entity_type' => $voucher::class,
                    'entity_id' => $voucher->id,
                    'price' => $voucher->validate_price,
                    'quantity' => 1,
                    'additional_info_json' => json_encode([
                        'voucher' => $voucher->load(['locationProfile.location'])
                    ]),
                ]);

                $voucher->update(['is_sold' => Voucher::SOLD]);
                $voucher->check_stock_notification();
            }
        }

        // create sale notification
        $sale->create_notification();

        // payed with deposit
        if ($sale->payed_with == Sale::PAYED_WITH_DEPOSIT) {
            $deposit = $customer->deposites()->create([
                'credit' => $total,
                'description' => $sale->code,
                'related_type' => Sale::class,
                'related_id' => $sale->id,
                'is_valid' => DepositHistory::STATUS_VALID,
            ]);
            $deposit->update_customer_balance();
        }

        // payed with paylater
        if ($sale->payed_with == Sale::PAYED_WITH_PAYLATER) {
            $paylater = $customer->paylaterHistories()->create([
                'debit' => $total,
                'description' => $sale->code,
            ]);
            $paylater->update_customer_paylater();
        }

        // bonus poin by reward
        $bonus = PoinReward::where('customer_level_id', $customer->customer_level_id)
            ->where('amount_buy', '<=', $total)
            ->orderBy('bonus_poin', 'desc')
            ->first();

        if ($bonus != null) {
            $poin = $customer->poins()->create([
                'debit' => $bonus->bonus_poin,
                'description' => 'Bonus Pembelian #' . $sale->code,
            ]);

            $poin->update_customer_balance();
        }

        // TODO : bonus poin by downline

        // remove carts
        $customer->carts()->delete();

        DB::commit();

        return redirect()->route('transactions.sale.show', $sale)
            ->with('message', ['type' => 'success', 'message' => 'pembelian berhasil']);
    }
}
