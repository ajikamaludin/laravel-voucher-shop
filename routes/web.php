<?php

use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CoinController;
use App\Http\Controllers\Customer\CoinExchangeController;
use App\Http\Controllers\Customer\DepositController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\PaylaterController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\TransactionController;
use App\Http\Controllers\Customer\VerificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['http_secure_aware', 'guard_should_customer', 'inertia.customer'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home.index');

    Route::get('/banner/{banner}', [HomeController::class, 'banner'])->name('home.banner');

    Route::middleware('auth:customer')->group(function () {
        // profile
        Route::get('profile', [ProfileController::class, 'index'])->name('customer.profile.index');
        Route::get('profile/update', [ProfileController::class, 'show'])->name('customer.profile.show');
        Route::post('profile/update', [ProfileController::class, 'update']);

        // verification
        Route::get('profile/verification', [VerificationController::class, 'index'])->name('customer.verification');
        Route::post('profile/verification', [VerificationController::class, 'update']);

        // logout
        Route::post('logout', [AuthController::class, 'destroy'])->name('customer.logout');

        // paylater
        Route::get('paylater', [PaylaterController::class, 'index'])->name('customer.paylater.index');
        Route::get('paylater/trx/{paylater}', [PaylaterController::class, 'show'])->name('customer.paylater.show');

        // deposite
        Route::get('deposit', [DepositController::class, 'index'])->name('customer.deposit.index');
        Route::get('deposit/topup', [DepositController::class, 'create'])->name('customer.deposit.topup');
        Route::post('deposit/topup', [DepositController::class, 'store']);
        Route::get('deposit/trx/{deposit}', [DepositController::class, 'show'])->name('customer.deposit.show');
        Route::post('deposit/trx/{deposit}', [DepositController::class, 'update'])->name('customer.deposit.update');

        // coin
        Route::get('coin/exchanges', [CoinExchangeController::class, 'index'])->name('customer.coin.exchange');
        Route::get('coin/exchanges/{voucher}', [CoinExchangeController::class, 'exchange'])->name('customer.coin.exchange.process');
        Route::get('coin', [CoinController::class, 'index'])->name('customer.coin.index');
        Route::get('coin/{coin}', [CoinController::class, 'show'])->name('customer.coin.show');

        // cart
        Route::get('cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('cart/process', [CartController::class, 'purchase'])->name('cart.purchase');
        Route::post('cart/{voucher}', [CartController::class, 'store'])->name('cart.store');

        // transaction
        Route::get('sale/trx', [TransactionController::class, 'index'])->name('transactions.index');
        Route::get('sale/trx/{sale}', [TransactionController::class, 'show'])->name('transactions.show');

        // notification
        Route::get('notifications', [HomeController::class, 'notification'])->name('notification.index');
    });

    Route::middleware('guest:customer')->group(function () {
        // login
        Route::get('/login', [AuthController::class, 'login'])->name('customer.login');
        Route::post('/login', [AuthController::class, 'update']);
        Route::get('/login/google', [AuthController::class, 'signin_google'])->name('customer.login.google');
        Route::get('/login/callback_google', [AuthController::class, 'callback_google'])->name('customer.login.callback_google');

        // register
        Route::get('/register', [AuthController::class, 'register'])->name('customer.register');
        Route::post('/register', [AuthController::class, 'store']);
    });
});

require_once 'admin.php';
