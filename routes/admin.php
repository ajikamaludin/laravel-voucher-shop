<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['http_secure_aware', 'inertia.admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/', fn () => redirect()->route('admin.login'));

        Route::middleware(['guest:web'])->group(function () {
            Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('admin.login');

            Route::post('login', [AuthenticatedSessionController::class, 'store']);
        });

        Route::middleware(['auth:web'])->group(function () {
            // dashboard
            Route::get('/dashboard', [GeneralController::class, 'index'])->name('dashboard');
            Route::get('/maintance', [GeneralController::class, 'maintance'])->name('maintance');

            // Admin Profile
            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

            // Logout
            Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

            // User
            Route::get('/users', [UserController::class, 'index'])->name('user.index');
            Route::post('/users', [UserController::class, 'store'])->name('user.store');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('user.update');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

            // Role
            Route::resource('/roles', RoleController::class);

            // Info
            Route::get('/infos', [InfoController::class, 'index'])->name('info.index');
            Route::post('/infos', [InfoController::class, 'store'])->name('info.store');
            Route::put('/infos/{info}', [InfoController::class, 'update'])->name('info.update');
            Route::delete('/infos/{info}', [InfoController::class, 'destroy'])->name('info.destroy');

            // Location
            Route::get('/locations', [LocationController::class, 'index'])->name('location.index');
            Route::post('/locations', [LocationController::class, 'store'])->name('location.store');
            Route::put('/locations/{location}', [LocationController::class, 'update'])->name('location.update');
            Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('location.destroy');

            // Account
            Route::get('/accounts', [AccountController::class, 'index'])->name('account.index');
            Route::post('/accounts', [AccountController::class, 'store'])->name('account.store');
            Route::put('/accounts/{account}', [AccountController::class, 'update'])->name('account.update');
            Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])->name('account.destroy');

            // upload
            Route::post('/upload', [GeneralController::class, 'upload'])->name('post.upload');

            // banner
            Route::get('/banner', [BannerController::class, 'index'])->name('banner.index');
            Route::get('/banner/create', [BannerController::class, 'create'])->name('banner.create');
            Route::post('/banner', [BannerController::class, 'store'])->name('banner.store');
            Route::get('/banner/{banner}', [BannerController::class, 'edit'])->name('banner.edit');
            Route::post('/banner/{banner}', [BannerController::class, 'update'])->name('banner.update');
            Route::delete('/banner/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

            // customer
            Route::get('/customers', [CustomerController::class, 'index'])->name('customer.index');
            Route::get('/customers/create', [CustomerController::class, 'create'])->name('customer.create');
            Route::post('/customers', [CustomerController::class, 'store'])->name('customer.store');
            Route::get('/customers/{customer}', [CustomerController::class, 'edit'])->name('customer.edit');
            Route::post('/customers/{customer}', [CustomerController::class, 'update'])->name('customer.update');
            Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');

            // setting
            Route::get('/settings', [SettingController::class, 'index'])->name('setting.index');
            Route::post('/settings', [SettingController::class, 'update'])->name('setting.update');
        });
    });
