<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\PaylaterHistory;
use Illuminate\Http\Request;

class PaylaterController extends Controller
{
    public function index()
    {
        $histories = PaylaterHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc');

        return inertia('Paylater/Index', [
            'histories' => $histories->paginate(20),
        ]);
    }

    public function show(Request $request, PaylaterHistory $paylater)
    {
        return inertia('Paylater/Detail', [
            'paylater' => $paylater,
        ]);
    }

    public function create()
    {
    }

    public function store()
    {
    }
}
