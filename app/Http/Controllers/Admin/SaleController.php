<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $customer_with_deposits = Sale::with('customer')
            ->whereHas('customer', function ($query) {
                $query->whereHas('locationFavorites', function ($query) {
                    $query->whereIn('id', Location::all()->pluck('id')->toArray());
                });
            })
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->where('payed_with', Sale::PAYED_WITH_DEPOSIT)
            ->groupBy('customer_id')
            ->selectRaw('SUM(amount) as total, customer_id')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        $customer_with_paylaters = Sale::with('customer')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->where('payed_with', Sale::PAYED_WITH_PAYLATER)
            ->groupBy('customer_id')
            ->selectRaw('SUM(amount) as total, customer_id')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        $query = Sale::with(['items', 'customer.level'])
            ->withCount(['items']);

        if ($request->q != '') {
            $query->where('code', 'ilike', "%$request->q%")
                ->orWhereHas('customer', function ($query) use ($request) {
                    $query->where('name', 'ilike', "%$request->q%")
                        ->orWhere('fullname', 'ilike', "%$request->q%")
                        ->orWhere('username', 'ilike', "%$request->q%");
                });
        }

        if ($request->location_ids != '') {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->whereHas('locationFavorites', function ($q) use ($request) {
                    $q->whereIn('location_id', $request->location_ids);
                });
            });
        }

        if ($request->payment != '') {
            $query->where('payed_with', $request->payment);
        } else {
            $query->whereIn('payed_with', [Sale::PAYED_WITH_PAYLATER, Sale::PAYED_WITH_DEPOSIT]);
        }

        if ($request->startDate != '' && $request->endDate != '') {
            $query->whereBetween(DB::raw('DATE(created_at)'), [$request->startDate, $request->endDate]);
        }

        $sortBy = 'created_at';
        $sortRule = 'desc';
        if ($request->sortBy != '' && $request->sortRule != '') {
            $sortBy = $request->sortBy;
            $sortRule = $request->sortRule;
        }

        $query->orderBy($sortBy, $sortRule);

        return inertia('Sale/Index', [
            'query' => $query->paginate(),
            'customer_with_deposit' => $customer_with_deposits,
            'customer_with_paylaters' => $customer_with_paylaters,
            '_q' => $request->q,
            '_sortBy' => $sortBy,
            '_sortRule' => $sortRule,
        ]);
    }

    public function show(Sale $sale)
    {
        return inertia('Sale/Detail', [
            'sale' => $sale->load(['items', 'customer.level']),
        ]);
    }
}
