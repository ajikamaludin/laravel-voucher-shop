<?php

use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CustomerLevelController;
use App\Http\Controllers\Customer\DepositController;
use App\Http\Controllers\Customer\DepositLocationController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\PaylaterController;
use App\Http\Controllers\Customer\PoinController;
use App\Http\Controllers\Customer\PoinExchangeController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\PWAController;
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

Route::view('/offline.html', 'offline');

Route::middleware(['http_secure_aware', 'guard_should_customer', 'inertia.customer'])->group(function () {
    Route::get('/index.html', [HomeController::class, 'index'])->name('home.index');
    Route::get('/', [HomeController::class, 'index'])->name('home.index');

    Route::get('/banner/{banner}', [HomeController::class, 'banner'])->name('home.banner');

    Route::middleware(['auth:customer', 'customer.is_complate_profile'])->group(function () {
        // location to favorite
        Route::post('/locations/{location}/add-favorite', [HomeController::class, 'addFavorite'])->name('customer.location.favorite');
        Route::get('/favorites', [HomeController::class, 'favorite'])->name('home.favorite');

        // verification
        Route::get('profile/verification', [VerificationController::class, 'index'])->name('customer.verification');
        Route::post('profile/verification', [VerificationController::class, 'update']);

        // logout
        Route::post('logout', [AuthController::class, 'destroy'])->name('customer.logout');

        // paylater
        Route::get('paylater', [PaylaterController::class, 'index'])->name('customer.paylater.index');
        Route::get('paylater/trx/{paylater}', [PaylaterController::class, 'show'])->name('customer.paylater.show');
        Route::get('paylater/repay', [PaylaterController::class, 'create'])->name('customer.paylater.repay');
        Route::post('paylater/repay', [PaylaterController::class, 'store']);

        // deposit
        Route::get('trx/deposit', [DepositController::class, 'index'])->name('transactions.deposit.index');
        Route::get('trx/deposit/topup', [DepositController::class, 'create'])->name('transactions.deposit.topup');
        Route::post('trx/deposit/topup', [DepositController::class, 'store']);
        Route::get('trx/deposit/{deposit}', [DepositController::class, 'show'])->name('transactions.deposit.show');
        Route::post('trx/deposit/{deposit}', [DepositController::class, 'update'])->name('transactions.deposit.update');

        // transaction
        Route::get('trx/sale', [TransactionController::class, 'index'])->name('transactions.sale.index');
        Route::get('trx/sale/{sale}', [TransactionController::class, 'show'])->name('transactions.sale.show');

        // poin
        Route::get('trx/poin', [PoinController::class, 'index'])->name('transactions.poin.index');
        Route::get('trx/poin/{poin}', [PoinController::class, 'show'])->name('transactions.poin.show');

        // poin exchange
        Route::get('poin/exchanges', [PoinExchangeController::class, 'index'])->name('customer.poin.exchange');
        Route::get('poin/exchanges/{profile}', [PoinExchangeController::class, 'exchange'])->name('customer.poin.exchange.process');

        // cart
        Route::get('cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('cart/process', [CartController::class, 'purchase'])->name('cart.purchase');
        Route::post('cart/{profile}', [CartController::class, 'store'])->name('cart.store');

        // notification
        Route::get('notifications', [HomeController::class, 'notification'])->name('notification.index');

        // customer level
        Route::get('customer-level', [CustomerLevelController::class, 'index'])->name('customer.customer-level.index');

        // cash deposit location
        Route::get('cash-deposit-locations', [DepositLocationController::class, 'index'])->name('customer.deposit-location.index');
    });

    Route::middleware('auth:customer')->group(function () {
        // profile
        Route::get('profile', [ProfileController::class, 'index'])->name('customer.profile.index');
        Route::get('profile/update', [ProfileController::class, 'show'])->name('customer.profile.show');
        Route::post('profile/update', [ProfileController::class, 'update']);
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

        //
        Route::get('/customer/{customer:id}/active', [AuthController::class, 'active'])->name('customer.active');
    });
});

// PWA Suppoer
Route::get('/manifest.json', [PWAController::class, 'manifest']);
Route::get('/.well-known/assetlinks.json', [PWAController::class, 'assetlinks']);

require_once 'admin.php';
