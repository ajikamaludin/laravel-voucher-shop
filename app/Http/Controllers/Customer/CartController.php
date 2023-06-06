<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CoinHistory;
use App\Models\CoinReward;
use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\Sale;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * show list of item in cart
     * has payed button
     * show payment method -> deposit, coin, paylater
     * 
     */
    public function index()
    {
        $carts = collect(session('carts') ?? []);
        $total = $carts->sum(function ($item) {
            return $item['quantity'] * $item['voucher']->price;
        });

        $customer = Customer::find(auth()->id());
        [$allowProcess, $isPaylater] = $customer->allowPay($total);

        return inertia('Cart/Index', [
            'carts' => $carts,
            'total' => $total,
            'allow_process' => $allowProcess,
            'is_paylater' => $isPaylater,
        ]);
    }

    /**
     * handle cart add, remove or sub
     *
     */
    public function store(Request $request, Voucher $voucher)
    {
        $operator = $request->param ?? 'add';
        $voucher->load(['location']);

        $carts = collect(session('carts') ?? []);
        if ($carts->count() > 0) {
            $item = $carts->firstWhere('id', $voucher->id);
            if ($item == null) {
                $carts->add(['id' => $voucher->id, 'quantity' => 1, 'voucher' => $voucher]);
                session(['carts' => $carts->toArray()]);
                session()->flash('message', ['type' => 'success', 'message' => 'voucher added to cart']);
            } else {
                $carts = $carts->map(function ($item) use ($voucher, $operator) {
                    if ($item['id'] == $voucher->id) {
                        if ($operator == 'delete') {
                            return ['id' => null];
                        }
                        if ($operator == 'add') {
                            $quantity = $item['quantity'] + 1;
                        }
                        if ($operator == 'sub') {
                            $quantity = $item['quantity'] - 1;
                            if ($quantity <= 0) {
                                $quantity = 1;
                            }
                        }

                        return [
                            ...$item,
                            'quantity' => $quantity,
                        ];
                    }

                    return $item;
                });
                $carts = $carts->whereNotNull('id')->toArray();
                session(['carts' => $carts]);
            }

            return;
        }

        session(['carts' => [
            ['id' => $voucher->id, 'quantity' => 1, 'voucher' => $voucher],
        ]]);
        session()->flash('message', ['type' => 'success', 'message' => 'voucher added to cart']);
    }

    /**
     * find correct voucher , reject if cant be found
     * create sale and item sale
     * credit deposit
     * redirect to show detail
     */
    public function purchase()
    {
        DB::beginTransaction();
        $carts = collect(session('carts'));

        if ($carts->count() == 0) {
            return redirect()->route('home.index')
                ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, keranjang anda kosong']);
        }

        // validate voucher is available
        foreach ($carts as $item) {
            $batchCount = $item['voucher']->count_unsold();
            if ($batchCount < $item['quantity']) {
                session()->remove('carts');
                return redirect()->route('home.index')
                    ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, voucher sedang tidak tersedia']);
            }
        };

        $total = $carts->sum(function ($item) {
            return $item['quantity'] * $item['voucher']->price;
        });

        $customer = Customer::find(auth()->id());

        $paylater_limit = (int) $customer->paylater_limit;
        if (($paylater_limit + $customer->deposit_balance) < $total) {
            session()->remove('carts');
            return redirect()->route('home.index')
                ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, pembayaran ditolak']);
        }

        $payedWith = Sale::PAYED_WITH_DEPOSIT;
        if ($total > $customer->deposit_balance && $customer->deposit_balance == 0) {
            $payedWith = Sale::PAYED_WITH_PAYLATER;
        }

        $sale = $customer->sales()->create([
            'code' => Str::random(5),
            'date_time' => now(),
            'amount' => $total,
            'payed_with' => $payedWith,
        ]);

        foreach ($carts as $item) {
            foreach (range(1, $item['quantity']) as $q) {
                $voucher = $item['voucher']->shuffle_unsold();
                $sale->items()->create([
                    'entity_type' => $voucher::class,
                    'entity_id' => $voucher->id,
                    'price' => $voucher->price,
                    'quantity' => 1,
                    'additional_info_json' => json_encode($item),
                ]);

                $voucher->update(['is_sold' => Voucher::SOLD]);
                $voucher->check_stock_notification();
            }
        }
        $sale->create_notification();

        $bonus = CoinReward::where('customer_level_id', $customer->customer_level_id)
            ->where('amount_buy', '<=', $total)
            ->orderBy('bonus_coin', 'desc')->first();

        if ($bonus != null) {
            $coin = $customer->coins()->create([
                'debit' => $bonus->bonus_coin,
                'description' => 'Bonus Pembelian #' . $sale->code,
            ]);

            $coin->update_customer_balance();
        }

        $description = 'Pembayaran #' . $sale->code;

        if ($customer->deposit_balance < $total) {
            if ($customer->deposit_balance > 0) {
                $deposit = $customer->deposites()->create([
                    'credit' => $customer->deposit_balance,
                    'description' => $description,
                    'related_type' => Sale::class,
                    'related_id' => $sale->id,
                    'is_valid' => DepositHistory::STATUS_VALID,
                ]);
                $deposit->update_customer_balance();
            }

            // payed with paylater
            $payedWithPaylater = $total - $customer->deposit_balance;
            $paylater = $customer->paylaterHistories()->create([
                'debit' => $payedWithPaylater,
                'description' => $description
            ]);

            $paylater->update_customer_paylater();
        }

        // deposit payment
        if ($customer->deposit_balance >= $total) {
            $deposit = $customer->deposites()->create([
                'credit' => $total,
                'description' => $description,
                'related_type' => Voucher::class,
                'related_id' => $sale->id,
                'is_valid' => DepositHistory::STATUS_VALID,
            ]);
            $deposit->update_customer_balance();
        }

        DB::commit();

        session()->remove('carts');

        return redirect()->route('transactions.show', $sale)
            ->with('message', ['type' => 'success', 'message' => 'pembelian berhasil']);
    }
}
