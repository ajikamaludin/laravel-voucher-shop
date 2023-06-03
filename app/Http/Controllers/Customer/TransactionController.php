<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Sale;

class TransactionController extends Controller
{
    public function index()
    {
        $query = Sale::where('customer_id', auth()->id())
            ->orderBy('created_at', 'desc');

        return inertia('Home/Trx/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function show(Sale $sale)
    {
        return inertia('Home/Trx/Detail', [
            'sale' => $sale->load(['items.voucher.location'])
        ]);
    }
}
