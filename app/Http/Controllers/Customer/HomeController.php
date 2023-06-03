<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Info;
use App\Models\Location;
use App\Models\Voucher;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();
        $locations = Location::get();
        $vouchers = Voucher::with(['location'])
            ->where('is_sold', Voucher::UNSOLD)
            ->groupBy('batch_id')
            ->orderBy('updated_at', 'desc');

        if ($request->location_id != '') {
            $vouchers->where('location_id', $request->location_id);
        }

        return inertia('Home/Index/Index', [
            'infos' => $infos,
            'banners' => $banners,
            'locations' => $locations,
            'vouchers' => tap($vouchers->paginate(10))->setHidden(['username', 'password']),
            '_location_id' => $request->location_id ?? '',
        ]);
    }

    public function banner(Banner $banner)
    {
        return inertia('Home/Index/Banner', [
            'banner' => $banner,
        ]);
    }
}
