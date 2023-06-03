<?php

namespace App\Http\Controllers;

use App\Models\CustomerLevel;
use Illuminate\Http\Request;

class CustomerLevelController extends Controller
{
    public function index()
    {
        $query = CustomerLevel::query();

        return inertia('CustomerLevel/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function update(Request $request, CustomerLevel $customerLevel)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|min:0',
        ]);

        $customerLevel->update([
            'name' => $request->name,
            'description' => $request->description,
            'min_amount' => $request->min_amount,
            'max_amount' => $request->max_amount,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
