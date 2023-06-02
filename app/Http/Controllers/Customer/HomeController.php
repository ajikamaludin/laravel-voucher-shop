<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Info;

class HomeController extends Controller
{
    public function index()
    {
        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();
        $banners = Banner::orderBy('updated_at', 'desc')->get();

        return inertia('Home/Index/Index', [
            'infos' => $infos,
            'banners' => $banners
        ]);
    }

    public function banner(Banner $banner)
    {
        return inertia('Home/Index/Banner', [
            'banner' => $banner,
        ]);
    }
}
