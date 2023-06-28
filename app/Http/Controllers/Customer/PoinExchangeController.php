<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Location;
use App\Models\Sale;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PoinExchangeController extends Controller
{
    public function index(Request $request)
    {
        $favorite = $request->favorite ?? 1;
        $customer = $request->user('customer');
        $flocations = $customer->locationFavorites;
        $slocations = [];
        $locations = Location::orderBy('name', 'asc')->get();

        $vouchers = Voucher::with(['locationProfile.location'])
            ->whereHas('locationProfile', function ($q) {
                $q->where('price_poin', '!=', 0)
                    ->orWhereHas('prices', function ($q) {
                        return $q->where('price_poin', '!=', 0);
                    });
            })
            ->where('is_sold', Voucher::UNSOLD)
            ->groupBy('location_profile_id')
            ->orderBy('updated_at', 'desc');

        if ($request->location_ids != '') {
            $vouchers->whereHas('locationProfile', function ($q) use ($request) {
                return $q->whereIn('location_id', $request->location_ids);
            });

            $slocations = Location::whereIn('id', $request->location_ids)->get();

            $vouchers = tap($vouchers->paginate(20))->setHidden(['username', 'password']);
        }

        if ($request->location_ids == '' && $flocations->count() > 0) {
            $favorite = 1;
            $vouchers->whereHas('locationProfile', function ($q) use ($flocations) {
                return $q->whereIn('location_id', $flocations->pluck('id')->toArray());
            });
            $vouchers = tap($vouchers->paginate(20))->setHidden(['username', 'password']);
        }

        return inertia('Poin/Exchange', [
            'locations' => $locations,
            'vouchers' => $vouchers,
            '_slocations' => $slocations,
            '_flocations' => $flocations,
            '_favorite' => $favorite
        ]);
    }

    public function exchange(Voucher $voucher)
    {
        $batchCount = $voucher->count_unsold();
        if ($batchCount < 1) {
            return redirect()->route('customer.poin.exchange')
                ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, voucher sedang tidak tersedia']);
        }

        $customer = Customer::find(auth()->id());

        if ($customer->poin_balance < $voucher->price_poin) {
            return redirect()->route('customer.poin.exchange')
                ->with('message', ['type' => 'error', 'message' => 'koin kamu tidak cukup untuk ditukar voucher ini']);
        }

        DB::beginTransaction();
        $sale = $customer->sales()->create([
            'code' => 'Tukar poin ' . str()->upper(str()->random(5)), //TODO changes this
            'date_time' => now(),
            'amount' => 0,
            'payed_with' => Sale::PAYED_WITH_POIN,
        ]);

        $voucher = $voucher->shuffle_unsold(1);
        $sale->items()->create([
            'entity_type' => $voucher::class,
            'entity_id' => $voucher->id,
            'price' => $voucher->price_poin,
            'quantity' => 1,
            'additional_info_json' => json_encode([
                'id' => $voucher->id,
                'quantity' => 1,
                'voucher' => $voucher->load(['location']),
            ]),
        ]);

        $voucher->update(['is_sold' => Voucher::SOLD]);
        $voucher->check_stock_notification();

        $sale->create_notification();

        $poin = $customer->poins()->create([
            'credit' => $voucher->price_poin,
            'description' => $sale->code,
        ]);

        $poin->update_customer_balance();
        DB::commit();

        return redirect()->route('transactions.sale.show', $sale)
            ->with('message', ['type' => 'success', 'message' => 'penukaran berhasil']);
    }
}
