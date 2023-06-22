<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query()->with(['level'])->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'like', "%$request->q%")
                ->orWhere('fullname', 'like', "%$request->q%")
                ->orWhere('email', 'like', "%$request->q%")
                ->orWhere('phone', 'like', "%$request->q%");
        }

        return inertia('Customer/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function create()
    {
        return inertia('Customer/Form', [
            'levels' => CustomerLevel::all(),
            'statuses' => Customer::STATUS
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username',
            'password' => 'required|string|min:8',
            'name' => 'required|string',
            'fullname' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'image' => 'nullable|image',
            'status' => 'required|numeric',
        ]);

        $customer = Customer::make([
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'name' => $request->name,
            'fullname' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'status' => $request->status,
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        $customer->save();

        return redirect()->route('customer.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Customer $customer)
    {
        return inertia('Customer/Form', [
            'customer' => $customer->load(['level']),
            'levels' => CustomerLevel::all(),
            'statuses' => Customer::STATUS
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username,' . $customer->id,
            'password' => 'nullable|string|min:8',
            'name' => 'required|string',
            'fullname' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'image' => 'nullable|image',
            'status' => 'required|numeric'
        ]);

        if ($request->password != '') {
            $customer->password = Hash::make($request->password);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        $customer->update([
            'username' => $request->username,
            'password' => $customer->password,
            'name' => $request->name,
            'fullname' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'image' => $customer->image,
            'status' => $request->status
        ]);

        return redirect()->route('customer.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customer.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function update_level(Request $request, Customer $customer)
    {
        $request->validate([
            'level' => 'required|exists:customer_levels,key',
            'paylater_limit' => 'required|numeric',
        ]);

        $level = CustomerLevel::where('key', $request->level)->first();

        $customer->update(['customer_level_id' => $level->id]);

        $customer->paylater()->updateOrCreate([
            'customer_id' => $customer->id,
        ], [
            'limit' => $request->paylater_limit,
        ]);

        return redirect()->route('customer.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }
}
