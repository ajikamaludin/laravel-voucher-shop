<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerLevelController;
use App\Http\Controllers\Admin\DepositController;
use App\Http\Controllers\Admin\DepositLocationController;
use App\Http\Controllers\Admin\GeneralController;
use App\Http\Controllers\Admin\InfoController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\LocationProfileController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PoinRewardController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Admin\VoucherController;
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
            Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
            Route::post('/users', [UserController::class, 'store'])->name('user.store');
            Route::get('/users/{user}', [UserController::class, 'edit'])->name('user.edit');
            Route::post('/users/{user}', [UserController::class, 'update'])->name('user.update');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

            // Role
            Route::resource('/roles', RoleController::class);

            // Info
            Route::get('/infos', [InfoController::class, 'index'])->name('info.index');
            Route::get('/infos/create', [InfoController::class, 'create'])->name('info.create');
            Route::post('/infos', [InfoController::class, 'store'])->name('info.store');
            Route::get('/infos/{info}', [InfoController::class, 'edit'])->name('info.edit');
            Route::put('/infos/{info}', [InfoController::class, 'update'])->name('info.update');
            Route::delete('/infos/{info}', [InfoController::class, 'destroy'])->name('info.destroy');

            // Location
            Route::get('/locations', [LocationController::class, 'index'])->name('location.index');
            Route::post('/locations', [LocationController::class, 'store'])->name('location.store');
            Route::put('/locations/{location}', [LocationController::class, 'update'])->name('location.update');
            Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('location.destroy');

            // Profile Location
            Route::get('/location-profile', [LocationProfileController::class, 'index'])->name('location-profile.index');
            Route::get('/location-profile/create', [LocationProfileController::class, 'create'])->name('location-profile.create');
            Route::post('/location-profile', [LocationProfileController::class, 'store'])->name('location-profile.store');
            Route::get('/location-profile/{profile}', [LocationProfileController::class, 'edit'])->name('location-profile.edit');
            Route::post('/location-profile/{profile}', [LocationProfileController::class, 'update'])->name('location-profile.update');
            Route::delete('/location-profile/{profile}', [LocationProfileController::class, 'destroy'])->name('location-profile.destroy');

            // Account
            Route::get('/accounts', [AccountController::class, 'index'])->name('account.index');
            Route::get('/accounts/create', [AccountController::class, 'create'])->name('account.create');
            Route::post('/accounts', [AccountController::class, 'store'])->name('account.store');
            Route::get('/accounts/{account}', [AccountController::class, 'edit'])->name('account.edit');
            Route::post('/accounts/{account}', [AccountController::class, 'update'])->name('account.update');
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

            // customer level
            Route::get('/customer-levels', [CustomerLevelController::class, 'index'])->name('customer-level.index');
            Route::get('/customer-levels/{customerLevel}', [CustomerLevelController::class, 'edit'])->name('customer-level.edit');
            Route::post('/customer-levels/{customerLevel}', [CustomerLevelController::class, 'update'])->name('customer-level.update');

            // verification
            Route::get('/customers-verifications', [VerificationController::class, 'index'])->name('customer-verification.index');
            Route::get('/customers-verifications/{customer}', [VerificationController::class, 'edit'])->name('customer-verification.edit');
            Route::post('/customers-verifications/{customer}', [VerificationController::class, 'update'])->name('customer-verification.update');

            // customer
            Route::get('/customers', [CustomerController::class, 'index'])->name('customer.index');
            Route::get('/customers/create', [CustomerController::class, 'create'])->name('customer.create');
            Route::post('/customers', [CustomerController::class, 'store'])->name('customer.store');
            Route::get('/customers/{customer}', [CustomerController::class, 'edit'])->name('customer.edit');
            Route::post('/customers/{customer}', [CustomerController::class, 'update'])->name('customer.update');
            Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');
            Route::post('/customers/{customer}/level', [CustomerController::class, 'update_level'])->name('customer.update_level');

            // voucher
            Route::get('/vouchers/import', [VoucherController::class, 'form_import'])->name('voucher.form_import');
            Route::post('/vouchers/import', [VoucherController::class, 'import'])->name('voucher.import');
            Route::get('/vouchers/create', [VoucherController::class, 'create'])->name('voucher.create');
            Route::post('/vouchers/bulk-delete', [VoucherController::class, 'bulkDelete'])->name('voucher.bulk-destroy');
            Route::post('/vouchers', [VoucherController::class, 'store'])->name('voucher.store');
            Route::get('/vouchers/{voucher}/edit', [VoucherController::class, 'edit'])->name('voucher.edit');
            Route::post('/vouchers/{voucher}/edit', [VoucherController::class, 'update'])->name('voucher.update');
            Route::delete('/vouchers/{voucher}', [VoucherController::class, 'destroy'])->name('voucher.destroy');
            Route::get('/vouchers', [VoucherController::class, 'location'])->name('voucher.location');
            Route::get('/vouchers/{location}', [VoucherController::class, 'profile'])->name('voucher.profile');
            Route::get('/vouchers/{location}/{profile}', [VoucherController::class, 'index'])->name('voucher.index');

            // setting
            Route::get('/payment-gateway', [SettingController::class, 'payment'])->name('setting.payment');
            Route::post('/payment-gateway', [SettingController::class, 'updatePayment']);
            Route::get('/affilate', [SettingController::class, 'affilate'])->name('setting.affilate');
            Route::post('/affilate', [SettingController::class, 'updateAffilate']);
            Route::get('/settings', [SettingController::class, 'index'])->name('setting.index');
            Route::post('/settings', [SettingController::class, 'update'])->name('setting.update');

            // deposit
            Route::get('/deposites', [DepositController::class, 'index'])->name('deposit.index');
            Route::post('/deposites/{deposit}', [DepositController::class, 'update'])->name('deposit.update');

            // poin rewared
            Route::get('/bonus-poin', [PoinRewardController::class, 'index'])->name('poin-reward.index');
            Route::post('/bonus-poin', [PoinRewardController::class, 'store'])->name('poin-reward.store');
            Route::put('/bonus-poin/{reward}', [PoinRewardController::class, 'update'])->name('poin-reward.update');
            Route::delete('/bonus-poin/{reward}', [PoinRewardController::class, 'destroy'])->name('poin-reward.destroy');

            // sale
            Route::get('/sales', [SaleController::class, 'index'])->name('sale.index');
            Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sale.show');

            // notification
            Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

            // deposit location 
            Route::get('/deposit-location', [DepositLocationController::class, 'index'])->name('deposit-location.index');
            Route::get('/deposit-location/create', [DepositLocationController::class, 'create'])->name('deposit-location.create');
            Route::post('/deposit-location', [DepositLocationController::class, 'store'])->name('deposit-location.store');
            Route::get('/deposit-location/{location}', [DepositLocationController::class, 'edit'])->name('deposit-location.edit');
            Route::post('/deposit-location/{location}', [DepositLocationController::class, 'update'])->name('deposit-location.update');
            Route::delete('/deposit-location/{location}', [DepositLocationController::class, 'destroy'])->name('deposit-location.destroy');
        });
    });
