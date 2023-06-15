<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaCustomerRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $carts = collect(session('carts') ?? []);
        $cart_count = 0;
        if ($carts->count() > 0) {
            foreach ($carts as $cart) {
                $cart_count += $cart['quantity'];
            }
        }

        $notification_count = 0;
        if (auth('customer')->check()) {
            $notification_count = Notification::where('entity_id', auth()->id())->where('is_read', Notification::UNREAD)->count();
        }

        return array_merge(parent::share($request), [
            'app_name' => env('APP_NAME', 'App Name'),
            'setting' => Setting::getSettings(),
            'auth' => [
                'user' => auth('customer')->user()?->load(['level', 'paylater']),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message') ?? ['type' => null, 'message' => null],
            ],
            'notification_count' => $notification_count,
            'cart_count' => $cart_count,

        ]);
    }
}
