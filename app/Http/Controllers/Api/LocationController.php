<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Location::orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'ilike', "%$request->q%");
        }

        return $query->limit(100)->get();
    }
}
