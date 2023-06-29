<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['items', 'customer.level'])
            ->withCount(['items'])
            ->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('code', 'ilike', "%$request->q%")
                ->orWhereHas('customer', function ($query) use ($request) {
                    $query->where('name', 'ilike', "%$request->q%")
                        ->orWhere('fullname', 'ilike', "%$request->q%")
                        ->orWhere('username', 'ilike', "%$request->q%");
                });
        }

        return inertia('Sale/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function show(Sale $sale)
    {
        return inertia('Sale/Detail', [
            'sale' => $sale->load(['items', 'customer.level']),
        ]);
    }
}
