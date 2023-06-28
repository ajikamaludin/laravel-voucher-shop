<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Customer;
use App\Models\CustomerLocationFavorite;
use App\Models\Info;
use App\Models\Location;
use App\Models\LocationProfile;
use App\Models\Notification;
use App\Models\Voucher;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    const LIMIT = 10;

    public function index(Request $request)
    {
        if ($request->direct != '' && auth()->guard('customer')->check()) {
            $customer = Customer::find(auth()->id());
            if ($request->location_ids == '' && $customer->locationFavorites()->count() > 0) {
                return redirect()->route('home.favorite');
            }
        }

        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        $slocations = [];

        $profiles = LocationProfile::with(['location'])
            ->whereHas('vouchers', function ($q) {
                $q->where('is_sold', Voucher::UNSOLD);
            })
            ->orderBy('updated_at', 'desc');

        if ($request->location_ids != '') {
            $profiles->whereIn('location_id', $request->location_ids);

            $slocations = Location::whereIn('id', $request->location_ids)->get();

            $profiles = $profiles->paginate(self::LIMIT);
        }

        if (auth()->guard('customer')->guest() && $request->location_ids == '') {
            $profiles = $profiles->paginate(self::LIMIT);
        }

        return inertia('Index/Index', [
            'infos' => $infos,
            'banners' => $banners,
            'locations' => $locations,
            'profiles' => $profiles,
            '_slocations' => $slocations,
            '_status' => 0
        ]);
    }

    public function favorite()
    {
        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        $profiles = LocationProfile::with(['location'])
            ->whereHas('vouchers', function ($q) {
                $q->where('is_sold', Voucher::UNSOLD);
            })
            ->orderBy('updated_at', 'desc');

        $customer = Customer::find(auth()->id());
        $profiles->whereIn('location_id', $customer->locationFavorites()->pluck('id')->toArray());

        return inertia('Index/Index', [
            'infos' => $infos,
            'banners' => $banners,
            'locations' => $locations,
            'profiles' => $profiles->paginate(self::LIMIT),
            '_flocations' => $customer->locationFavorites,
            '_status' => 1
        ]);
    }

    public function banner(Banner $banner)
    {
        return inertia('Index/Banner', [
            'banner' => $banner,
        ]);
    }

    public function addFavorite(Location $location)
    {
        $customer = Customer::find(auth()->id());

        $customer->locationFavorites()->toggle([$location->id]);
    }

    public function notification()
    {
        Notification::where('entity_id', auth()->id())->where('is_read', Notification::UNREAD)->update(['is_read' => Notification::READ]);

        return inertia('Index/Notification', [
            'notification' => Notification::where('entity_id', auth()->id())->orderBy('created_at', 'desc')->paginate(),
        ]);
    }
}
