<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocationProfile;
use Illuminate\Http\Request;

class LocationProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = LocationProfile::with(['location'])
            ->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'ilike', "%$request->q%")
                ->orWhere('display_note', 'ilike', "%$request->q%")
                ->orWhereHas('location', fn ($q) => $q->where('name', 'ilike', "%$request->q%"));
        }

        return $query->limit(100)->get();
    }
}
