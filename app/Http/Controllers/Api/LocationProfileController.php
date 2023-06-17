<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocationProfile;
use Illuminate\Http\Request;

class LocationProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = LocationProfile::with(['location'])->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'like', "%$request->q%")
                ->orWhere('display_note', 'like', "%$request->q%")
                ->orWhereHas('location', fn ($q) => $q->where('name', 'like', "%$request->q%"));
        }

        return $query->limit(100)->get();
    }
}
