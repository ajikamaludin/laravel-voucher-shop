<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\CustomerVerification;
use App\Models\Customer;
use App\Models\Setting;
use App\Services\AsyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
        session()->remove('carts');

        return inertia('Auth/Login');
    }

    public function update(Request $request)
    {
        $request->validate([
            'username' => 'required|string|alpha_dash',
            'password' => 'required|string',
        ]);

        $user = Customer::where([
            'username' => $request->username,
        ])->first();

        $password = Hash::check($request->password, $user->password);
        if (!$password) {
            return redirect()->route('customer.login')
                ->with('message', ['type' => 'error', 'message' => 'Invalid credentials']);
        }

        if ($user->status == Customer::STATUS_INACTIVE) {
            return redirect()->route('customer.login')
                ->with('message', ['type' => 'error', 'message' => 'Akun belum aktif, Silahkan klik link verifikasi di email anda']);
        }

        // Akun Suspend
        // if ($user->status == Customer::STATUS_SUSPEND) {
        //     return redirect()->route('customer.login')
        //         ->with('message', ['type' => 'error', 'message' => 'Akun anda telah disuspend, silahkan hubungi penyedia layanan']);
        // }

        $isAuth = Auth::guard('customer')->login($user);
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
            info('auth google error', ['exception' => $e]);
            return redirect()->route('customer.login')
                ->with('message', ['type' => 'error', 'message' => 'Google authentication fail, please try again']);
        }

        $customer = Customer::where('email', $user->email)->first();
        if ($customer == null) {
            $customer = Customer::where('google_id', $user->id)->first();
        }
        if ($customer == null) {
            DB::beginTransaction();
            $customer = Customer::create([
                'fullname' => $user->name,
                'name' => $user->nickname,
                'email' => $user->email,
                'username' => Str::slug($user->name . '_' . Str::random(5), '_'),
                'google_id' => $user->id,
                'google_oauth_response' => json_encode($user),
                'status' => Customer::STATUS_ACTIVE,
            ]);
            $this->process_referral($customer, session('referral_code', ''));
            DB::commit();
        } else {
            $customer->update(['google_oauth_response' => json_encode($user)]);
        }

        // Akun Suspend
        // if ($customer->status == Customer::STATUS_SUSPEND) {
        //     return redirect()->route('customer.login')
        //         ->with('message', ['type' => 'error', 'message' => 'Akun anda telah disuspend, silahkan hubungi penyedia layanan']);
        // }

        Auth::guard('customer')->loginUsingId($customer->id);

        return redirect()->route('home.index');
    }

    public function register(Request $request)
    {
        session()->remove('carts');

        $code = '';
        if ($request->referral_code != '') {
            session()->put('referral_code', $request->referral_code);
            $code = $request->referral_code;
        } else {
            $code = session('referral_code', ' ');
        }

        return inertia('Auth/Register', [
            'referral_code' => $code,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fullname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:9|max:16',
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username',
            'password' => 'required|string|min:8|confirmed',
            'referral_code' => 'nullable|exists:customers,referral_code',
        ]);

        DB::beginTransaction();
        $customer = Customer::create([
            'fullname' => $request->fullname,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'email' => $request->email,
            'status' => Customer::STATUS_INACTIVE,
        ]);

        // send confirmation email
        AsyncService::async(fn () => Mail::to($request->email)->send(new CustomerVerification($customer)));

        $this->process_referral($customer, $request->referral_code);
        DB::commit();

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'success', 'message' => 'Silahkan  verifikasi dengan klik link verifikasi di email anda']);
    }

    public function destroy()
    {
        session()->remove('carts');

        Auth::logout();

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'success', 'message' => 'anda telah keluar, sampai jumpa kembali']);
    }

    public function active(Customer $customer)
    {
        if ($customer->email_varified_at != null) {
            return redirect()->route('customer.login');
        }

        $customer->update([
            'status' => Customer::STATUS_ACTIVE,
            'email_varified_at' => now(),
        ]);

        return redirect()->route('customer.login')
            ->with('message', ['type' => 'success', 'message' => 'Akun anda berhasil diaktifkan, silahkan login']);
    }

    private function process_referral(Customer $customer, $code)
    {
        if ($code != '') {
            $refferal = Customer::where('referral_code', $code)->first();
            if ($refferal == null) {
                session()->forget('referral_code');
                return;
            }
            $refferal->customerRefferals()->create([
                'refferal_id' => $customer->id,
                'customer_code' => $refferal->referral_code,
            ]);

            $affilateEnabled = Setting::getByKey('AFFILATE_ENABLED');
            if ($affilateEnabled == 1) {
                $bonuspoin = Setting::getByKey('AFFILATE_poin_AMOUNT');
                $poin = $refferal->poins()->create([
                    'debit' => $bonuspoin,
                    'description' => 'Bonus Refferal #' . Str::random(5),
                ]);

                $poin->update_customer_balance();
            }
        }
    }
}
