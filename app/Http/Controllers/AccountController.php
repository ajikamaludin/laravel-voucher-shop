<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        $query = Account::orderBy('updated_at', 'desc')->paginate();

        return inertia('Account/Index', [
            'query' => $query,
        ]);
    }

    public function create()
    {
        return inertia('Account/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'bank_name' => 'required|string',
            'holder_name' => 'required|string',
            'account_number' => 'required|string',
            'admin_fee' => 'required|numeric',
            'logo' => 'required|image',
        ]);

        $file = $request->file('logo');
        $file->store('uploads', 'public');
        
        Account::create([
            'name' => $request->name,
            'bank_name' => $request->bank_name,
            'holder_name' => $request->holder_name,
            'account_number' => $request->account_number,
            'admin_fee' => $request->admin_fee,
            'logo' => $file->hashName('uploads'),
        ]);

        return redirect()->route('account.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has been saved']);
    }

    public function edit(Account $account)
    {
        return inertia('Account/Form', [
            'account' => $account
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $request->validate([
            'name' => 'required|string',
            'bank_name' => 'required|string',
            'holder_name' => 'required|string',
            'account_number' => 'required|string',
            'admin_fee' => 'required|numeric',
            'logo' => 'nullable|image',
        ]);


        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $file->store('uploads', 'public');
            $account->fill(['logo' => $file->hashName('uploads')]);
        }

        $account->update([
            'name' => $request->name,
            'bank_name' => $request->bank_name,
            'holder_name' => $request->holder_name,
            'account_number' => $request->account_number,
            'admin_fee' => $request->admin_fee
        ]);

        return redirect()->route('account.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has been updated']);
    }

    public function destroy(Account $account)
    {
        $account->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been deleted']);
    }
}
