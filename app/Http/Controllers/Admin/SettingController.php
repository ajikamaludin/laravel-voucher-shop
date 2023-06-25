<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerLevel;
use App\Models\Setting;
use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        $setting = Setting::all();

        return inertia('Setting/Index', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'OPEN_WEBSITE_NAME' => 'required|string',
            'SHARE_TEXT' => 'required|string',
            'ENABLE_CASH_DEPOSIT' => 'required|in:0,1',
            'ADMINFEE_CASH_DEPOSIT' => 'required|numeric',
            'TEXT_CASH_DEPOSIT' => 'required|string',
            'ENABLE_MANUAL_TRANSFER' => 'required|in:0,1',
            'ADMINFEE_MANUAL_TRANSFER' => 'required|numeric',
            'MAX_MANUAL_TRANSFER_TIMEOUT' => 'required|numeric',
            'MANUAL_TRANSFER_OPEN_HOUR' => 'required|string',
            'MANUAL_TRANSFER_CLOSE_HOUR' => 'required|string',
            'MAX_POINT_EXPIRED' => 'required|numeric',
        ]);

        DB::beginTransaction();
        $inputs = $request->except(['MANUAL_TRANSFER_OPEN_HOUR', 'MANUAL_TRANSFER_CLOSE_HOUR']);
        foreach ($inputs as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        $hours = $request->only(['MANUAL_TRANSFER_OPEN_HOUR', 'MANUAL_TRANSFER_CLOSE_HOUR']);
        foreach ($hours as $key => $value) {
            Setting::where('key', $key)->update(['value' => GeneralService::parserToHour($value)]);
        }

        Cache::flush();

        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Setting has beed saved']);
    }

    public function payment()
    {
        $setting = Setting::all();

        return inertia('Setting/Payment', [
            'setting' => $setting,
            'midtrans_notification_url' => route('api.midtrans.notification'),

        ]);
    }

    public function updatePayment(Request $request)
    {
        $request->validate([
            'MIDTRANS_SERVER_KEY' => 'required|string',
            'MIDTRANS_CLIENT_KEY' => 'required|string',
            'MIDTRANS_MERCHANT_ID' => 'required|string',
            'MIDTRANS_ADMIN_FEE' => 'required|numeric',
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

        Cache::flush();

        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Setting has beed saved']);
    }

    public function affilate()
    {
        $setting = Setting::all();

        return inertia('Setting/Affilate', [
            'setting' => $setting,
            'levels' => CustomerLevel::all()
        ]);
    }

    public function updateAffilate(Request $request)
    {
        $request->validate([
            'AFFILATE_ENABLED' => 'required|in:0,1',
            'AFFILATE_POIN_AMOUNT' => 'required|numeric',
            'AFFILATE_DOWNLINE_POIN_AMOUNT' => 'required|numeric',
            'AFFILATE_SHARE_REFFERAL_CODE' => 'required|string',
            'AFFILATE_ALLOWED_LEVELS' => 'required|array',
            'AFFILATE_ALLOWED_LEVELS.*.key' => 'required|exists:customer_levels,key',
        ]);

        DB::beginTransaction();
        foreach ($request->except(['AFFILATE_ALLOWED_LEVELS']) as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        $allowedLevel = collect($request->AFFILATE_ALLOWED_LEVELS)->toArray();

        Setting::where('key', 'AFFILATE_ALLOWED_LEVELS')->update([
            'value' => json_encode($allowedLevel)
        ]);

        Cache::flush();

        DB::commit();

        session()->flash('message', ['type' => 'success', 'message' => 'Setting has beed saved']);
    }
}
