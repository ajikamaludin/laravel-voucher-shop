<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerLevel;
use App\Models\LocationProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = LocationProfile::with(['location'])->orderBy('updated_at', 'desc');

        if ($request->location_id != '') {
            $query->where('location_id', $request->location_id);
        }

        if ($request->q != '') {
            $query->where('name', 'ilike', "%$request->q%")
                ->orWhere('display_note', 'ilike', "%$request->q%");
        }

        return inertia('LocationProfile/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function create()
    {
        return inertia('LocationProfile/Form', [
            'expireds' => LocationProfile::EXPIRED_UNIT,
            'levels' => CustomerLevel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string',
            'quota' => 'required|string',
            'display_note' => 'nullable|string',
            'expired' => 'required|numeric',
            'expired_unit' => 'required|string',
            'description' => 'nullable|string',
            'min_stock' => 'required|numeric',
            'display_price' => 'required|numeric',
            'discount' => 'required|numeric|min:0|max:100',
            'price_poin' => 'required|numeric',
            'bonus_poin' => 'required|numeric',
            'prices' => 'nullable|array',
            'prices.*.customer_level_id' => 'required|exists:customer_levels,id',
            'prices.*.display_price' => 'required|numeric',
            'prices.*.discount' => 'required|numeric|min:0|max:100',
            'prices.*.price_poin' => 'required|numeric',
            'prices.*.bonus_poin' => 'required|numeric',
        ]);

        DB::beginTransaction();
        $profile = LocationProfile::create([
            'location_id' => $request->location_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'display_note' => $request->display_note,
            'expired' => $request->expired,
            'expired_unit' => $request->expired_unit,
            'description' => $request->description,
            'min_stock' => $request->min_stock,
            'display_price' => $request->display_price,
            'discount' => $request->discount,
            'price_poin' => $request->price_poin,
            'bonus_poin' => $request->bonus_poin,
        ]);

        $prices = collect($request->prices);
        if ($prices->count() > 0) {
            foreach ($prices as $price) {
                $profile->prices()->create([
                    'customer_level_id' => $price['customer_level_id'],
                    'display_price' => $price['display_price'],
                    'discount' => $price['discount'],
                    'price_poin' => $price['price_poin'],
                    'bonus_poin' => $price['bonus_poin'],
                ]);
            }
        }
        DB::commit();

        return redirect()->route('location-profile.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(LocationProfile $profile)
    {
        return inertia('LocationProfile/Form', [
            'expireds' => LocationProfile::EXPIRED_UNIT,
            'levels' => CustomerLevel::all(),
            'profile' => $profile->load(['location', 'prices.level']),
        ]);
    }

    public function update(Request $request, LocationProfile $profile)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string',
            'quota' => 'required|string',
            'display_note' => 'nullable|string',
            'expired' => 'required|numeric',
            'expired_unit' => 'required|string',
            'description' => 'nullable|string',
            'min_stock' => 'required|numeric',
            'display_price' => 'required|numeric',
            'discount' => 'required|numeric|min:0|max:100',
            'price_poin' => 'required|numeric',
            'bonus_poin' => 'required|numeric',
            'prices' => 'nullable|array',
            'prices.*.customer_level_id' => 'required|exists:customer_levels,id',
            'prices.*.display_price' => 'required|numeric',
            'prices.*.discount' => 'required|numeric|min:0|max:100',
            'prices.*.price_poin' => 'required|numeric',
            'prices.*.bonus_poin' => 'required|numeric',
        ]);

        DB::beginTransaction();
        $profile->update([
            'location_id' => $request->location_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'display_note' => $request->display_note,
            'expired' => $request->expired,
            'expired_unit' => $request->expired_unit,
            'description' => $request->description,
            'min_stock' => $request->min_stock,
            'display_price' => $request->display_price,
            'discount' => $request->discount,
            'price_poin' => $request->price_poin,
            'bonus_poin' => $request->bonus_poin,
        ]);

        $profile->prices()->delete();
        $prices = collect($request->prices);
        if ($prices->count() > 0) {
            foreach ($prices as $price) {
                $profile->prices()->create([
                    'customer_level_id' => $price['customer_level_id'],
                    'display_price' => $price['display_price'],
                    'discount' => $price['discount'],
                    'price_poin' => $price['price_poin'],
                    'bonus_poin' => $price['bonus_poin'],
                ]);
            }
        }
        DB::commit();

        return redirect()->route('location-profile.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(LocationProfile $profile)
    {
        $profile->delete();

        return redirect()->route('location-profile.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
