<?php

namespace App\Http\Controllers;

use App\Models\CustomerLevel;
use App\Models\Location;
use App\Models\LocationProfile;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VoucherController extends Controller
{
    public function location(Request $request)
    {
        $query = Location::orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'like', "%$request->q%");
        }

        return inertia('Voucher/Location', [
            'query' => tap($query->paginate(20))->append(['count_vouchers']),
        ]);
    }

    public function profile(Request $request, Location $location)
    {
        $query = LocationProfile::where('location_id', $location->id)
            ->orderBy('updated_at', 'desc');

        if ($request->location_id != '') {
            $query->where('location_id', $request->location_id);
        }

        if ($request->q != '') {
            $query->where('name', 'like', "%$request->q%")
                ->orWhere('display_note', 'like', "%$request->q%");
        }

        return inertia('Voucher/Profile', [
            'query' => tap($query->paginate(20))->append(['count_vouchers']),
            'location' => $location,
            'stats' => Voucher::stats($location),
        ]);
    }

    public function index(Request $request, Location $location, LocationProfile $profile)
    {
        $query = Voucher::with(['profile.location'])
            ->where('location_profile_id', $profile->id)
            ->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('username', 'like', "%$request->q%")
                ->orWhere('comment', 'like', "%$request->q%")
                ->orWhere('profile', 'like', "%$request->q%");
        }

        return inertia('Voucher/Index', [
            'query' => $query->paginate(),
            'location' => $location,
            'profile' => $profile,
            'stats' => Voucher::stats($location),
        ]);
    }

    public function create()
    {
        return inertia('Voucher/Form', [
            'levels' => CustomerLevel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_profile_id' => 'required|exists:location_profiles,id',
            'username' => 'required|string',
        ]);

        Voucher::create([
            'location_profile_id' => $request->location_profile_id,
            'username' => $request->username,
            'password' => $request->username,
        ]);

        $profile = LocationProfile::find($request->location_profile_id);

        return redirect()->route('voucher.index', [
            'location' => $profile->location_id,
            'profile' => $profile->id
        ])
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Voucher $voucher)
    {
        return inertia('Voucher/Form', [
            'voucher' => $voucher->load(['prices.level']),
            'levels' => CustomerLevel::all(),
        ]);
    }

    public function update(Request $request, Voucher $voucher)
    {
        $request->validate([
            'location_profile_id' => 'required|exists:location_profiles,id',
            'username' => 'required|string',
        ]);

        $voucher->update([
            'location_profile_id' => $request->location_profile_id,
            'username' => $request->username,
            'password' => $request->username,
        ]);

        $profile = LocationProfile::find($request->location_profile_id);

        return redirect()->route('voucher.index', [
            'location' => $profile->location_id,
            'profile' => $profile->id
        ])
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();

        return redirect()->route('voucher.index', [
            'location' => $voucher->profile->location_id,
            'profile' => $voucher->profile->id
        ])
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function form_import()
    {
        return inertia('Voucher/Import');
    }

    public function import(Request $request)
    {
        $request->validate([
            'script' => 'required|string',
            'location_profile_id' => 'required|exists:location_profiles,id',

        ]);
        $profile = LocationProfile::find($request->location_profile_id);

        $vouchers = GeneralService::script_parser($request->script);

        if (count($vouchers) <= 0) {
            return redirect()->route('voucher.index', [
                'location' => $profile->location_id,
                'profile' => $profile->id
            ])
                ->with('message', ['type' => 'error', 'message' => 'Nothing to import']);
        }

        DB::beginTransaction();
        foreach ($vouchers as $voucher) {
            $voucher = Voucher::create([
                'location_profile_id' => $request->location_profile_id,
                'username' => $voucher['username'],
                'password' => $voucher['password'],
                'quota' => $voucher['quota'],
                'profile' => $voucher['profile'],
                'comment' => $voucher['comment'],
            ]);
        }
        DB::commit();


        return redirect()->route('voucher.index', [
            'location' => $profile->location_id,
            'profile' => $profile->id
        ])
            ->with('message', ['type' => 'success', 'message' => 'Items has beed saved']);
    }
}
