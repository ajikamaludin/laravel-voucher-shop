<?php

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\LocationController;
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

// midtrans
Route::post('mindtrans/notification', fn () => 'Ok!')->name('api.midtrans.notification');
