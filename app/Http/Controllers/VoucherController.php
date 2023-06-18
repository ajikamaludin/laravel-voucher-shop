<?php

namespace App\Http\Controllers;

use App\Models\CustomerLevel;
use App\Models\Location;
use App\Models\LocationProfile;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
        $query = Voucher::with(['locationProfile.location'])
            ->where('location_profile_id', $profile->id);

        if ($request->q != '') {
            $query->where('username', 'like', "%$request->q%")
                ->orWhere('comment', 'like', "%$request->q%")
                ->orWhere('profile', 'like', "%$request->q%");
        }

        if ($request->sortBy != '' && $request->sortRule != '') {
            $query->orderBy($request->sortBy, $request->sortRule);
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        return inertia('Voucher/Index', [
            'query' => $query->paginate(20),
            'location' => $location,
            'profile' => $profile,
            'stats' => Voucher::stats($location),
            '_search' => $request->q,
            '_sortBy' => $request->sortBy,
            '_sortRule' => $request->sortRule,
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
        $location_id = $voucher->locationProfile->location_id;
        $profile_id = $voucher->locationProfile->id;

        $voucher->delete();

        return redirect()->route('voucher.index', [
            'location' => $location_id,
            'profile' => $profile_id,
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

    public function bulkDelete(Request $request)
    {
        $query = Voucher::query();
        if ($request->rule == 1) {
            $query->where('deleted_at', null)->delete();

            return redirect()->route('voucher.location')
                ->with('message', ['type' => 'success', 'message' => 'All Item has beed deleted']);
        }

        if ($request->location_profile_id != '') {
            $query->where('location_profile_id', $request->location_profile_id);
        }

        if ($request->comment != '') {
            $query->where('comment', $request->comment);
        }

        if ($request->import_date != '') {
            $query->whereDate('created_at', Carbon::parse($request->import_date));
        }

        $cond = [$request->location_profile_id == '', $request->comment == '', $request->import_date == ''];
        if (in_array(false, $cond)) {
            $count = $query->count();
            $query->delete();

            return redirect()->route('voucher.location')
                ->with('message', ['type' => 'success', 'message' => "$count Item has beed deleted"]);
        }


        return redirect()->route('voucher.location')
            ->with('message', ['type' => 'error', 'message' => "Items not found to delete"]);
    }
}
