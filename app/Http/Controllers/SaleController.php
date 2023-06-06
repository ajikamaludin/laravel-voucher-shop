<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        $query = Sale::with(['items.voucher', 'customer.level'])
            ->withCount(['items']);

        return inertia('Sale/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function show(Sale $sale)
    {
        return inertia('Sale/Detail', [
            'sale' => $sale->load(['items.voucher', 'customer.level']),
        ]);
    }
}
