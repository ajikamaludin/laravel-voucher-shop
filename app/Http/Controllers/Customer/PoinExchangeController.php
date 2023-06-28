<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Location;
use App\Models\LocationProfile;
use App\Models\Sale;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PoinExchangeController extends Controller
{
    public function index(Request $request)
    {
        $customer = $request->user('customer');

        $flocations = $customer->locationFavorites;
        $slocations = [];

        $favorite = $request->favorite ?? 0;
        if ($request->favorite == '') {
            $favorite = $customer->locationFavorites->count() > 0 ? 1 : 0;
        }

        $locations = Location::orderBy('name', 'asc')->get();

        $profiles = LocationProfile::with(['location'])
            ->whereHas('vouchers', function ($q) {
                $q->where('is_sold', Voucher::UNSOLD);
            })
            ->where(function ($q) {
                $q->where('price_poin', '!=', 0)->orWhereHas('prices', function ($q) {
                    return $q->where('price_poin', '!=', 0);
                });
            })
            ->orderBy('updated_at', 'desc');

        if ($favorite == 0) {
            if ($request->location_ids != '') {
                $profiles->whereIn('location_id', $request->location_ids);
                $profiles = $profiles->paginate(20);

                $slocations = Location::whereIn('id', $request->location_ids)->get();
            }
        }

        if ($favorite == 1) {
            $profiles->whereIn('location_id', $flocations->pluck('id')->toArray());
            $profiles = $profiles->paginate(20);
        }

        return inertia('PoinExchange/Index', [
            'locations' => $locations,
            'profiles' => $profiles,
            '_slocations' => $slocations,
            '_flocations' => $flocations,
            '_favorite' => $favorite
        ]);
    }

    public function exchange(Request $request, LocationProfile $profile)
    {
        $customer = $request->user('customer');
        if (!$customer->allow_transaction) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'akun anda dibekukan tidak dapat melakukan transaksi',]);
        }

        $batchCount = $profile->count_unsold();
        if ($batchCount < 1) {
            return redirect()->route('customer.poin.exchange')
                ->with('message', ['type' => 'error', 'message' => 'transaksi gagal, voucher sedang tidak tersedia']);
        }

        $customer = Customer::find(auth()->id());

        if ($customer->poin_balance < $profile->validate_price_poin) {
            return redirect()->route('customer.poin.exchange')
                ->with('message', ['type' => 'error', 'message' => 'poin kamu tidak cukup untuk ditukar voucher ini']);
        }

        DB::beginTransaction();
        $sale = $customer->sales()->create([
            'code' => GeneralService::generateExchangePoinCode(),
            'date_time' => now(),
            'amount' => $profile->validate_price_poin,
            'payed_with' => Sale::PAYED_WITH_POIN,
        ]);

        $vouchers = $profile->shuffle_unsold(1);
        foreach ($vouchers as $voucher) {
            $sale->items()->create([
                'entity_type' => $voucher::class,
                'entity_id' => $voucher->id,
                'price' => $voucher->validate_price_poin,
                'quantity' => 1,
                'additional_info_json' => json_encode([
                    'voucher' => $voucher->load(['locationProfile.location'])
                ]),
            ]);

            $voucher->update(['is_sold' => Voucher::SOLD]);
            $voucher->check_stock_notification();

            $poin = $customer->poins()->create([
                'credit' => $voucher->validate_price_poin,
                'description' => $sale->code,
                'narration' => 'Penukaran Voucher Poin'
            ]);

            $poin->update_customer_balance(true);
        }

        $sale->create_notification();

        DB::commit();

        return redirect()->route('transactions.sale.show', $sale)
            ->with('message', ['type' => 'success', 'message' => 'penukaran berhasil']);
    }
}
