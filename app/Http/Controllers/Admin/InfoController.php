<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Info;
use Illuminate\Http\Request;

class InfoController extends Controller
{
    public function index()
    {
        $query = Info::orderBy('updated_at', 'desc')->paginate();

        return inertia('Info/Index', [
            'query' => $query,
        ]);
    }

    public function create()
    {
        return inertia('Info/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'is_publish' => 'required|in:0,1',
        ]);

        Info::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_publish' => $request->is_publish,
        ]);

        return redirect()->route('info.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Info $info)
    {
        return inertia('Info/Form', [
            'info' => $info
        ]);
    }

    public function update(Request $request, Info $info)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'is_publish' => 'required|in:0,1',
        ]);

        $info->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_publish' => $request->is_publish,
        ]);

        return redirect()->route('info.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Info $info)
    {
        $info->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
