<?php

namespace App\Http\Controllers;

use App\Models\CustomerLevel;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = Voucher::with(['location'])->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('username', 'like', "%$request->q%")
                ->orWhere('comment', 'like', "%$request->q%")
                ->orWhere('profile', 'like', "%$request->q%");
        }

        if ($request->location_id != '') {
            $query->where('location_id', $request->location_id);
        }

        return inertia('Voucher/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function create()
    {
        return inertia('Voucher/Form', [
            'levels' => CustomerLevel::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'location_id' => 'required|exists:locations,id',
            'username' => 'required|string',
            'password' => 'required|string',
            'discount' => 'required|numeric',
            'display_price' => 'required|numeric',
            'price_coin' => 'nullable|numeric',
            'quota' => 'required|string',
            'profile' => 'required|string',
            'comment' => 'required|string',
            'expired' => 'required|numeric',
            'expired_unit' => 'required|string',
            'prices' => 'nullable|array',
            'prices.*.customer_level_id' => 'required|exists:customer_levels,id',
            'prices.*.display_price' => 'required|numeric'
        ]);

        DB::beginTransaction();
        $voucher = Voucher::create([
            'name' => $request->name,
            'description' => $request->description,
            'location_id' => $request->location_id,
            'username' => $request->username,
            'password' => $request->password,
            'discount' => $request->discount,
            'display_price' => $request->display_price,
            'price_coin' => $request->price_coin,
            'quota' => $request->quota,
            'profile' => $request->profile,
            'comment' => $request->comment,
            'expired' => $request->expired,
            'expired_unit' => $request->expired_unit,
        ]);

        foreach (collect($request->prices) as $price) {
            $finalPrice = $price['display_price'];
            if ($voucher->discount > 0) {
                $finalPrice = $finalPrice - round($finalPrice * ($voucher->discount / 100), 2);
            }
            $voucher->prices()->create([
                'customer_level_id' => $price['customer_level_id'],
                'price' => $finalPrice,
                'display_price' => $price['display_price'],
            ]);
        }
        DB::commit();

        return redirect()->route('voucher.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Voucher $voucher)
    {
        return inertia('Voucher/Form', [
            'voucher' => $voucher->load(['prices.level']),
            'levels' => CustomerLevel::all()
        ]);
    }

    public function update(Request $request, Voucher $voucher)
    {
        $request->validate([
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'location_id' => 'required|exists:locations,id',
            'username' => 'required|string',
            'password' => 'required|string',
            'discount' => 'required|numeric',
            'display_price' => 'required|numeric',
            'price_coin' => 'nullable|numeric',
            'quota' => 'required|string',
            'profile' => 'required|string',
            'comment' => 'required|string',
            'expired' => 'required|numeric',
            'expired_unit' => 'required|string',
            'prices' => 'nullable|array',
            'prices.*.customer_level_id' => 'required|exists:customer_levels,id',
            'prices.*.display_price' => 'required|numeric'
        ]);

        DB::beginTransaction();
        $voucher->update([
            'name' => $request->name,
            'description' => $request->description,
            'location_id' => $request->location_id,
            'username' => $request->username,
            'password' => $request->password,
            'discount' => $request->discount,
            'display_price' => $request->display_price,
            'price_coin' => $request->price_coin,
            'quota' => $request->quota,
            'profile' => $request->profile,
            'comment' => $request->comment,
            'expired' => $request->expired,
        ]);

        $voucher->prices()->delete();
        foreach (collect($request->prices) as $price) {
            $finalPrice = $price['display_price'];
            if ($voucher->discount > 0) {
                $finalPrice = $finalPrice - round($finalPrice * ($voucher->discount / 100), 2);
            }
            $voucher->prices()->create([
                'customer_level_id' => $price['customer_level_id'],
                'price' => $finalPrice,
                'display_price' => $price['display_price'],
            ]);
        }
        DB::commit();

        return redirect()->route('voucher.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();

        return redirect()->route('voucher.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function form_import()
    {
        return inertia('Voucher/Import', [
            'levels' => CustomerLevel::all()
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'script' => 'required|string',
            'location_id' => 'required|exists:locations,id',
            'discount' => 'required|numeric',
            'display_price' => 'required|numeric',
            'price_coin' => 'nullable|numeric',
            'expired' => 'required|numeric',
            'expired_unit' => 'required|string',
            'prices' => 'nullable|array',
            'prices.*.customer_level_id' => 'required|exists:customer_levels,id',
            'prices.*.display_price' => 'required|numeric'
        ]);

        $batchId = Str::ulid();
        $vouchers = GeneralService::script_parser($request->script);

        DB::beginTransaction();
        foreach ($vouchers as $voucher) {
            $voucher = Voucher::create([
                'location_id' => $request->location_id,
                'username' => $voucher['username'],
                'password' => $voucher['password'],
                'discount' => $request->discount,
                'display_price' => $request->display_price,
                'price_coin' => $request->price_coin,
                'quota' => $voucher['quota'],
                'profile' => $voucher['profile'],
                'comment' => $voucher['comment'],
                'expired' => $request->expired,
                'expired_unit' => $request->expired_unit,
                'batch_id' => $batchId,
            ]);

            foreach (collect($request->prices) as $price) {
                $finalPrice = $price['display_price'];
                if ($voucher->discount > 0) {
                    $finalPrice = $finalPrice - round($finalPrice * ($voucher->discount / 100), 2);
                }
                $voucher->prices()->create([
                    'customer_level_id' => $price['customer_level_id'],
                    'price' => $finalPrice,
                    'display_price' => $price['display_price'],
                ]);
            }
        }
        DB::commit();

        return redirect()->route('voucher.index')
            ->with('message', ['type' => 'success', 'message' => 'Items has beed saved']);
    }
}
