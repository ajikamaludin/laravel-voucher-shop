<?php

use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\HomeController;
use Illuminate\Support\Facades\Auth;
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

Route::middleware(['guard_should_customer', 'inertia.customer'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home.index');

    Route::middleware('auth:customer')->group(function () {
        // profile
        Route::get('profile', [ProfileController::class, 'index'])->name('customer.profile.index');
        Route::get('profile/update', [ProfileController::class, 'show'])->name('customer.profile.show');
        Route::post('profile/update', [ProfileController::class, 'update']);
        // logout
        Route::post('logout', [AuthController::class, 'destroy'])->name('customer.logout');
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
