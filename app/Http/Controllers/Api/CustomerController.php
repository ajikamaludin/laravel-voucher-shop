<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'ilike', "%$request->q%")
                ->orWhere('fullname', 'ilike', "%$request->q%")
                ->orWhere('username', 'ilike', "%$request->q%");
        }

        if ($request->levels != '') {
            $query->whereHas('level', fn ($q) => $q->whereIn('key', $request->levels));
        }

        return $query->limit(100)->get();
    }
}
