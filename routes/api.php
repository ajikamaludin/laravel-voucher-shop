<?php

use App\Events\NotificationEvent;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CustomerLevelController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\LocationProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\DepositController;
use App\Http\Middleware\CustomerApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// general
Route::get('/roles', [RoleController::class, 'index'])->name('api.role.index');
Route::get('/locations', [LocationController::class, 'index'])->name('api.location.index');
Route::get('/location-profiles', [LocationProfileController::class, 'index'])->name('api.location-profile.index');
Route::get('/customers', [CustomerController::class, 'index'])->name('api.customer.index');
Route::get('/customer-levels', [CustomerLevelController::class, 'index'])->name('api.customer-level.index');
Route::get('/notifications/{notif?}', [NotificationController::class, 'update'])->name('api.notification.update');

// midtrans
Route::post('mindtrans/notification', [DepositController::class, 'mindtrans_notification'])->name('api.midtrans.notification');
Route::post('mindtrans/{deposit}/payment', [DepositController::class, 'midtrans_payment'])->name('api.midtrans.payment');

// cart customer
Route::middleware([CustomerApi::class])->group(function () {
    Route::post('cart/{profile}', [CartController::class, 'store'])->name('api.cart.store');
});
