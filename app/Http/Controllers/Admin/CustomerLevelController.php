<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

    public function edit(CustomerLevel $customerLevel)
    {
        return inertia('CustomerLevel/Form', [
            'customer_level' => $customerLevel,
        ]);
    }

    public function update(Request $request, CustomerLevel $customerLevel)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|min:0',
            'logo' => 'nullable|image',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $file->store('uploads', 'public');
            $customerLevel->logo = $file->hashName('uploads');
        }

        $customerLevel->update([
            'name' => $request->name,
            'description' => $request->description,
            'min_amount' => $request->min_amount,
            'max_amount' => $request->max_amount,
            'logo' => $customerLevel->logo,
        ]);

        return redirect()->route('customer-level.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
