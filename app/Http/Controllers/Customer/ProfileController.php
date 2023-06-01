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
            'username' => 'string|required|min:5|alpha_dash|unique:customers,username,' . $customer->id,
            'password' => 'nullable|string|min:8|confirmed',
            'image' => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName();
        }

        $customer->update([
            'fullname' => $request->fullname,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'image' => $customer->image,
        ]);
    }
}
