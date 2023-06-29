<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::where('customer_id', auth()->id())
            ->orderBy('created_at', 'desc');

        $start_date = now()->startOfMonth();
        $end_date = now()->endOfMonth();
        if ($request->startDate != '' && $request->endDate != '') {
            $start_date = Carbon::parse($request->startDate);
            $end_date = Carbon::parse($request->endDate);
        }

        $query->whereBetween('created_at', [$start_date, $end_date]);

        return inertia('Trx/Index', [
            'query' => $query->paginate(20),
            '_start_date' => $start_date->format('m/d/Y'),
            '_end_date' => $end_date->format('m/d/Y'),
        ]);
    }

    public function show(Sale $sale)
    {
        return inertia('Trx/Detail', [
            'sale' => $sale->load(['items.voucher.locationProfile.location']),
        ]);
    }
}
