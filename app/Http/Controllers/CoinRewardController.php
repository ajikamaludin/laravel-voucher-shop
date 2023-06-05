<?php

namespace App\Http\Controllers;

use App\Models\CoinReward;
use App\Models\CustomerLevel;
use Illuminate\Http\Request;

class CoinRewardController extends Controller
{
    public function index()
    {
        $query = CoinReward::with(['level'])
            ->orderBy('updated_at', 'desc');

        return inertia('CoinReward/Index', [
            'query' => $query->paginate(),
            'levels' => CustomerLevel::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount_buy' => 'required|numeric',
            'bonus_coin' => 'required|numeric',
            'customer_level_id' => 'required|exists:customer_levels,id',
        ]);

        CoinReward::create([
            'amount_buy' => $request->amount_buy,
            'bonus_coin' => $request->bonus_coin,
            'customer_level_id' => $request->customer_level_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, CoinReward $reward)
    {
        $request->validate([
            'amount_buy' => 'required|numeric',
            'bonus_coin' => 'required|numeric',
            'customer_level_id' => 'required|exists:customer_levels,id',
        ]);

        $reward->update([
            'amount_buy' => $request->amount_buy,
            'bonus_coin' => $request->bonus_coin,
            'customer_level_id' => $request->customer_level_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(CoinReward $reward)
    {
        $reward->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
