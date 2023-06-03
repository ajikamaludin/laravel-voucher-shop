<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        $setting = Setting::all();

        return inertia('Setting/Index', [
            'setting' => $setting,
            'midtrans_notification_url' => route('api.midtrans.notification'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'AFFILATE_ENABLED' => 'required|in:0,1',
            'AFFILATE_COIN_AMOUNT' => 'required|numeric',
            'MIDTRANS_SERVER_KEY' => 'required|string',
            'MIDTRANS_CLIENT_KEY' => 'required|string',
            'MIDTRANS_MERCHANT_ID' => 'required|string',
            'MIDTRANS_ENABLED' => 'required|in:0,1',
            'midtrans_logo_file' => 'nullable|image',
        ]);

        DB::beginTransaction();
        foreach ($request->except(['midtrans_logo_file']) as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        if ($request->hasFile('midtrans_logo_file')) {
            $file = $request->file('midtrans_logo_file');
            $file->store('uploads', 'public');
            Setting::where('key', 'MIDTRANS_LOGO')->update(['value' => $file->hashName('uploads')]);
        }

        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Setting has beed saved']);
    }
}
