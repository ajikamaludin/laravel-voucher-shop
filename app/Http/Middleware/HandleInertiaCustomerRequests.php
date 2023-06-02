<?php

namespace App\Http\Middleware;

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
        return array_merge(parent::share($request), [
            'app_name' => env('APP_NAME', 'App Name'),
            'auth' => [
                'user' => auth('customer')->user()?->load(['level']),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message') ?? ['type' => null, 'message' => null],
            ],
            'notification_count' => 0,
            'carts' => []
        ]);
    }
}
