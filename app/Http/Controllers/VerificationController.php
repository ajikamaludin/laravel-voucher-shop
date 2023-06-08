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
            'query' => $query->paginate(),
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
            'levels' => $levels,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'level' => 'required|exists:customer_levels,key',
            'paylater_limit' => 'required|numeric',
        ]);

        $level = CustomerLevel::where('key', $request->level)->first();

        $customer->update([
            'customer_level_id' => $level->id,
            'identity_verified' => Customer::VERIFIED,
        ]);

        $customer->paylater()->updateOrCreate([
            'customer_id' => $customer->id,
        ], [
            'limit' => $request->paylater_limit,
        ]);

        return redirect()->route('customer-verification.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
