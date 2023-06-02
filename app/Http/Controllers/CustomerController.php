<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query()->with(['level']);

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
        return inertia('Customer/Form');
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
            'image' => 'nullable|string',
        ]);

        Customer::create([
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'name' => $request->name,
            'fullname' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'image' => $request->image,
        ]);

        return redirect()->route('customer.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Customer $customer)
    {
        return inertia('Customer/Form', [
            'customer' => $customer
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
        ]);

        if ($request->password != '') {
            $customer->password = bcrypt($request->password);
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
}
