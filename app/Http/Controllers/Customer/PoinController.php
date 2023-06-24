<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\PoinHistory;

class PoinController extends Controller
{
    public function index()
    {
        $poins = PoinHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc');

        return inertia('Poin/Index', [
            'poins' => $poins->paginate(20),
        ]);
    }

    public function show(PoinHistory $poin)
    {
        return inertia('Poin/Detail', [
            'poin' => $poin,
        ]);
    }
}
