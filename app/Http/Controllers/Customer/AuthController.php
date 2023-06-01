<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerLevel;
use App\Models\CustomerLevelHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\Config;

class AuthController extends Controller
{
    public function login()
    {
        return inertia('Home/Auth/Login');
    }

    public function update(Request $request)
    {
        $request->validate([
            'username' => 'string|required|alpha_dash',
            'password' => 'string|required',
        ]);

        $isAuth = Auth::guard('customer')->attempt(['username' => $request->username, 'password' => $request->password]);
        if ($isAuth) {
            return redirect()->route('home.index');
        }

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'error', 'message' => 'invalid credentials']);
    }

    public function signin_google()
    {
        $config = new Config(
            env('GOOGLE_CLIENT_ID'),
            env('GOOGLE_CLIENT_SECRET'),
            route('customer.login.callback_google')
        );

        return Socialite::driver('google')
            ->setConfig($config)
            ->redirect();
    }

    public function callback_google()
    {
        $user = Socialite::driver('google')->user();
        $customer = Customer::where('google_id', $user->id)->first();
        if ($customer == null) {
            DB::beginTransaction();
            $basic = CustomerLevel::where('key', CustomerLevel::BASIC)->first();
            $customer = Customer::create([
                'fullname' => $user->name,
                'name' => $user->nickname,
                'email' => $user->email,
                'username' => Str::random(10),
                'google_id' => $user->id,
                'google_oauth_response' => json_encode($user),
                'customer_level_id' => $basic->id,
            ]);

            CustomerLevelHistory::create([
                'customer_id' => $customer->id,
                'customer_level_id' => $basic->id,
                'date_time' => now(),
            ]);
            DB::commit();
        }

        Auth::guard('customer')->loginUsingId($customer->id);

        return redirect()->route('home.index');
    }

    public function register()
    {
        return inertia('Home/Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'fullname' => 'string|required',
            'name' => 'string|required',
            'address' => 'string|required',
            'phone' => 'string|required|numeric',
            'username' => 'string|required|min:5|alpha_dash|unique:customers,username',
            'password' => 'string|required|min:8|confirmed',
        ]);

        DB::beginTransaction();
        $basic = CustomerLevel::where('key', CustomerLevel::BASIC)->first();
        $customer = Customer::create([
            'fullname' => $request->fullname,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'customer_level_id' => $basic->id,
        ]);
        CustomerLevelHistory::create([
            'customer_id' => $customer->id,
            'customer_level_id' => $basic->id,
            'date_time' => now(),
        ]);
        DB::commit();

        Auth::guard('customer')->loginUsingId($customer->id);

        return redirect()->route('home.index');
    }

    public function destroy()
    {
        Auth::logout();

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'success', 'message' => 'you are logged out, see you next time']);
    }
}
