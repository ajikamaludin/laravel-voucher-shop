<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Info;

class HomeController extends Controller
{
    public function index()
    {
        $infos = Info::where('is_publish', 1)->orderBy('updated_at', 'desc')->get();

        return inertia('Home/Index/Index', [
            'infos' => $infos,
        ]);
    }
}
