<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
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

        return inertia('Cart/Index', [
            'carts' => $carts,
            'total' => $total,
            'allow_process' => '', //TODO: check allow process payment
            'is_paylater' => '', //check is transaction use paylater
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
        $sale = $customer->sales()->create([
            'code' => Str::random(5),
            'date_time' => now(),
            'amount' => $total,
            'payed_with' => Sale::PAYED_WITH_DEPOSIT,
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
            }
        }

        // TODO: is use paylater track the paylater
        // TODO: if use paylater credit all deposit if available
        $deposit = $customer->deposites()->create([
            'credit' => $total,
            'description' => 'Pembayaran #' . $sale->code,
            'related_type' => $sale::class,
            'related_id' => $sale->id,
            'is_valid' => DepositHistory::STATUS_VALID,
        ]);
        $deposit->update_customer_balance();

        DB::commit();

        session()->remove('carts');

        return redirect()->route('transactions.show', $sale)
            ->with('message', ['type' => 'success', 'message' => 'pembelian berhasil']);
    }
}
