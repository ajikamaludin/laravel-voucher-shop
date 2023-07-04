<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function index()
    {
        $shareText = Setting::getByKey('AFFILATE_SHARE_REFFERAL_CODE');

        return inertia('Profile/Index', [
            'share_text' => $shareText,
        ]);
    }

    public function show()
    {
        return inertia('Profile/Form');
    }

    public function update(Request $request)
    {
        $customer = auth()->user();

        $request->validate([
            'fullname' => 'string|required',
            'name' => 'string|nullable',
            'address' => 'string|required',
            'phone' => 'string|required|numeric',
            'username' => 'string|required|min:5|alpha_dash|unique:customers,username,' . $customer->id,
            'password' => 'nullable|string|min:8|confirmed',
            'image' => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        if ($request->password != null) {
            $customer->password = Hash::make($request->password);
        }

        $customer->update([
            'fullname' => $request->fullname,
            'name' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'image' => $customer->image,
            'password' => $customer->password,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'profile updated']);
    }
}
