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
            $query->where('name', 'like', "%$request->q%")
                ->orWhere('fullname', 'like', "%$request->q%")
                ->orWhere('username', 'like', "%$request->q%");
        }

        return $query->get();
    }
}
