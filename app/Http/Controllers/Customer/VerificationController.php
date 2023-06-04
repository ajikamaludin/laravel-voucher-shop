<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function index()
    {
        return inertia('Verification/Index');
    }

    public function update(Request $request)
    {
        $request->validate(['image' => 'required|image']);

        $customer = Customer::where('id', auth()->id())->first();

        $file = $request->file('image');
        $file->store('uploads/KTP', 'public');
        $customer->update([
            'identity_image' => $file->hashName('uploads/KTP'),
            'identity_verified' => Customer::IN_VERICATION,
        ]);

        return redirect()->route('customer.verification')
            ->with('message', ['type' => 'success', 'message' => 'verification is in progress']);
    }
}
