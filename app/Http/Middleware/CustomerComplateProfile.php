<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerComplateProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $customer = $request->user('customer');

        if (!$customer->is_profile_complate) {
            return redirect()->route('customer.profile.show')
                ->with('message', ['type' => 'error', 'message' => 'silahkan lengkapi profile sebelum dapat ber-transaksi']);
        }

        return $next($request);
    }
}
