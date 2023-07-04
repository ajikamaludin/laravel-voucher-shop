<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()->with(['role']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('User/Index', [
            'data' => $query->paginate(10),
        ]);
    }

    public function create()
    {
        return inertia('User/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|max:255',
            'role_id' => 'required|ulid|exists:roles,id',
            'username' => 'required|alpha_dash|unique:users,username',
            'phone_wa' => 'required|string',
            'photo' => 'required|image',
        ]);

        $file = $request->file('photo');
        $file->store('uploads', 'public');

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id,
            'username' => $request->username,
            'phone_wa' => $request->phone_wa,
            'photo' => $file->hashName('uploads'),
        ]);

        return redirect()->route('user.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(User $user)
    {
        return inertia('User/Form', [
            'user' => $user->load(['role']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|max:255',
            'username' => 'required|alpha_dash|unique:users,username,'.$user->id,
            'phone_wa' => 'required|string',
            'photo' => 'nullable|image',
        ]);

        if ($user->role != null) {
            $request->validate([
                'role_id' => 'required|ulid|exists:roles,id',
            ]);
        }

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $file->store('uploads', 'public');
            $user->fill(['photo' => $file->hashName('uploads')]);
        }

        $user->fill([
            'email' => $request->email,
            'name' => $request->name,
            'role_id' => $request->role_id,
            'username' => $request->username,
            'phone_wa' => $request->phone_wa,
        ]);

        if ($request->password != '') {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return redirect()->route('user.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->role_id == null) {
            return redirect()->route('user.index')
                ->with('message', ['type' => 'error', 'message' => 'Item default can\'t deleted']);
        }

        $user->delete();

        return redirect()->route('user.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
