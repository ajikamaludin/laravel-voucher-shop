<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CoinHistory;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    public function index()
    {
        $coins = CoinHistory::where('customer_id', auth()->id())
            ->orderBy('updated_at', 'desc');

        return inertia('Home/Coin/Index', [
            'coins' => $coins->paginate(20),
        ]);
    }

    public function show(CoinHistory $coin)
    {
        return inertia('Home/Coin/Detail', [
            'coin' => $coin,
        ]);
    }
}
