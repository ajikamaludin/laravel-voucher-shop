<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return inertia('Home/Profile/Index');
    }

    public function show()
    {
        return inertia('Home/Profile/Form');
    }

    public function update(Request $request)
    {
        $customer = auth()->user();

        $request->validate([
            'fullname' => 'string|required',
            'name' => 'string|required',
            'address' => 'string|required',
            'phone' => 'string|required|numeric',
            'username' => 'string|required|min:5|alpha_dash|unique:customers,username,'.$customer->id,
            'password' => 'nullable|string|min:8|confirmed',
            'image' => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        if ($request->password != null) {
            $customer->password = bcrypt($request->password);
        }

        $customer->update([
            'fullname' => $request->fullname,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'image' => $customer->image,
            'password' => $customer->password,
        ]);

        redirect()->route('customer.profile.show')
            ->with('message', ['type' => 'success', 'message' => 'profile updateded']);
    }
}
