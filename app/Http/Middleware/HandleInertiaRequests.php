<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'admin';

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
            'auth' => [
                'user' => $request->user() ? $request->user()->load(['role.permissions']) : $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
            'app_name' => env('APP_NAME', 'App Name'),
            'csrf_token' => csrf_token(),
            'notifications' => Notification::where('entity_type', \App\Models\User::class)->orderBy('created_at', 'desc')->limit(10)->get(),
            'count_unread_notifications' => Notification::where('entity_type', \App\Models\User::class)->where('is_read', Notification::UNREAD)->count(),
        ]);
    }
}
