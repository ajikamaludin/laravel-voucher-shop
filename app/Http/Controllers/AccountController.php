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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'bank_name' => 'required|string',
            'holder_name' => 'required|string',
            'account_number' => 'required|string',
        ]);

        Account::create([
            'name' => $request->name,
            'bank_name' => $request->bank_name,
            'holder_name' => $request->holder_name,
            'account_number' => $request->account_number,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been saved']);
    }

    public function update(Request $request, Account $account)
    {
        $request->validate([
            'name' => 'required|string',
            'bank_name' => 'required|string',
            'holder_name' => 'required|string',
            'account_number' => 'required|string',
        ]);

        $account->update([
            'name' => $request->name,
            'bank_name' => $request->bank_name,
            'holder_name' => $request->holder_name,
            'account_number' => $request->account_number,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been updated']);
    }

    public function destroy(Account $account)
    {
        $account->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been deleted']);
    }
}
