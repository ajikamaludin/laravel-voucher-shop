<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerLevel;
use Illuminate\Http\Request;

class CustomerLevelController extends Controller
{
    public function index()
    {
        return inertia('CustomerLevel/Index', [
            'levels' => CustomerLevel::all(),
        ]);
    }
}
