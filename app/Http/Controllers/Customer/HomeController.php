<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Customer;
use App\Models\CustomerLocationFavorite;
use App\Models\Info;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Voucher;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    const LIMIT = 2;

    public function index(Request $request)
    {
        if ($request->direct != '') {
            $customer = Customer::find(auth()->id());
            if ($request->location_ids == '' && $customer->locationFavorites()->count() > 0) {
                return redirect()->route('customer.home.favorite');
            }
        }

        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        $slocations = [];

        $vouchers = Voucher::with(['locationProfile.location'])
            ->where('is_sold', Voucher::UNSOLD)
            ->orderBy('updated_at', 'desc')
            ->groupBy('location_profile_id');

        if ($request->location_ids != '') {
            $vouchers->whereHas('locationProfile', function ($q) use ($request) {
                return $q->whereIn('location_id', $request->location_ids);
            });

            $slocations = Location::whereIn('id', $request->location_ids)->get();

            $vouchers = tap($vouchers->paginate(self::LIMIT))->setHidden(['username', 'password']);
        }

        if (auth()->guard('customer')->guest() && $request->location_ids != '') {
            $vouchers = tap($vouchers->paginate(self::LIMIT))->setHidden(['username', 'password']);
        }

        return inertia('Index/Index', [
            'infos' => $infos,
            'banners' => $banners,
            'locations' => $locations,
            'vouchers' => $vouchers,
            '_slocations' => $slocations,
            '_status' => 0
        ]);
    }

    public function favorite()
    {
        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        $vouchers = Voucher::with(['locationProfile.location'])
            ->where('is_sold', Voucher::UNSOLD)
            ->orderBy('updated_at', 'desc')
            ->groupBy('location_profile_id');

        $customer = Customer::find(auth()->id());
        $vouchers->whereHas('locationProfile', function ($q) use ($customer) {
            return $q->whereIn('location_id', $customer->locationFavorites()->pluck('id')->toArray());
        });

        return inertia('Index/Index', [
            'infos' => $infos,
            'banners' => $banners,
            'locations' => $locations,
            'vouchers' => tap($vouchers->paginate(self::LIMIT))->setHidden(['username', 'password']),
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
