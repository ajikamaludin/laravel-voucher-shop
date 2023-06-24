<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerLevel;
use App\Models\PoinReward;
use Illuminate\Http\Request;

class PoinRewardController extends Controller
{
    public function index()
    {
        $query = PoinReward::with(['level'])
            ->orderBy('updated_at', 'desc');

        return inertia('PoinReward/Index', [
            'query' => $query->paginate(),
            'levels' => CustomerLevel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount_buy' => 'required|numeric',
            'bonus_poin' => 'required|numeric',
            'customer_level_id' => 'required|exists:customer_levels,id',
        ]);

        PoinReward::create([
            'amount_buy' => $request->amount_buy,
            'bonus_poin' => $request->bonus_poin,
            'customer_level_id' => $request->customer_level_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, PoinReward $reward)
    {
        $request->validate([
            'amount_buy' => 'required|numeric',
            'bonus_poin' => 'required|numeric',
            'customer_level_id' => 'required|exists:customer_levels,id',
        ]);

        $reward->update([
            'amount_buy' => $request->amount_buy,
            'bonus_poin' => $request->bonus_poin,
            'customer_level_id' => $request->customer_level_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(PoinReward $reward)
    {
        $reward->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
