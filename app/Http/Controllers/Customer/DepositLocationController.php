<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\DepositLocation;
use Illuminate\Http\Request;

class DepositLocationController extends Controller
{
    public function index()
    {
        return inertia('DepositLocation/Index', [
            'locations' => DepositLocation::orderBy('updated_at', 'desc')->paginate(20),
        ]);
    }
}
