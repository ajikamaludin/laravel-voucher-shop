<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['inertia.admin'])
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
        });
    });
