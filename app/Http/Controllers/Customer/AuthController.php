<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\Config;

class AuthController extends Controller
{
    private $config;

    public function __construct()
    {
        $this->config = new Config(
            env('GOOGLE_CLIENT_ID'),
            env('GOOGLE_CLIENT_SECRET'),
            route('customer.login.callback_google')
        );
    }

    public function login()
    {
        return inertia('Home/Auth/Login');
    }

    public function update(Request $request)
    {
        $request->validate([
            'username' => 'required|string|alpha_dash',
            'password' => 'required|string',
        ]);

        $isAuth = Auth::guard('customer')->attempt(['username' => $request->username, 'password' => $request->password]);
        if ($isAuth) {
            return redirect()->route('home.index');
        }

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'error', 'message' => 'Invalid credentials']);
    }

    public function signin_google()
    {
        return Socialite::driver('google')
            ->setConfig($this->config)
            ->redirect();
    }

    public function callback_google()
    {
        try {
            $user = Socialite::driver('google')
                ->setConfig($this->config)
                ->user();
        } catch (\Exception $e) {
            return redirect()->route('customer.login')
                ->with('message', ['type' => 'error', 'message' => 'Google authentication fail, please try again']);
        }

        $customer = Customer::where('google_id', $user->id)->first();
        if ($customer == null) {
            DB::beginTransaction();
            $customer = Customer::create([
                'fullname' => $user->name,
                'name' => $user->nickname,
                'email' => $user->email,
                'username' => Str::slug($user->name . '_' . Str::random(5), '_'),
                'google_id' => $user->id,
                'google_oauth_response' => json_encode($user),
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
            'fullname' => 'required|string',
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|numeric',
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username',
            'password' => 'required|string|min:8|confirmed',
            'referral_code' => 'nullable|exists:customers,referral_code'
        ]);

        DB::beginTransaction();
        $customer = Customer::create([
            'fullname' => $request->fullname,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);

        if ($request->referral_code != '') {
            $refferal = Customer::where('referral_code', $request->referral_code)->first();
            $refferal->customerRefferals()->create([
                'refferal_id' => $customer->id,
                'customer_code' => $refferal->referral_code
            ]);

            $affilateEnabled = Setting::getByKey('AFFILATE_ENABLED');
            if ($affilateEnabled == 1) {
                $bonusCoin = Setting::getByKey('AFFILATE_COIN_AMOUNT');
                $coin = $refferal->coins()->create([
                    'debit' => $bonusCoin,
                    'description' => 'Bonus Refferal #' . Str::random(5),
                ]);

                $coin->update_customer_balance();
            }
        }

        DB::commit();

        Auth::guard('customer')->loginUsingId($customer->id);

        return redirect()->route('home.index');
    }

    public function destroy()
    {
        Auth::logout();

        session()->flush();

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'success', 'message' => 'you are logged out, see you next time']);
    }
}
