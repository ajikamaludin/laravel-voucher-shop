<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLevel;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function index()
    {
        $query = Customer::with(['level'])
            ->where('identity_verified', Customer::IN_VERICATION)
            ->orderBy('updated_at', 'desc');

        return inertia('Verification/Index', [
            'query' => $query->paginate()
        ]);
    }

    public function edit(Customer $customer)
    {
        $levels = [
            CustomerLevel::where('key', CustomerLevel::GOLD)->first(),
            CustomerLevel::where('key', CustomerLevel::PLATINUM)->first(),
        ];

        return inertia('Verification/Form', [
            'customer' => $customer->load(['level']),
            'levels' => $levels
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        // TODO: here 
        $request->validate([]);
        // 
        $customer->update([]);
    }
}
