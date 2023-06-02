<?php

namespace App\Http\Controllers;

use App\Models\Info;
use Illuminate\Http\Request;

class InfoController extends Controller
{
    public function index()
    {
        $query = Info::paginate();

        return inertia('Info/Index', [
            'query' => $query,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'info' => 'required|string',
            'is_publish' => 'required|in:0,1',
        ]);

        Info::create([
            'title' => $request->info,
            'is_publish' => $request->is_publish,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Info $info)
    {
        $request->validate([
            'info' => 'required|string',
            'is_publish' => 'required|in:0,1',
        ]);

        $info->update([
            'title' => $request->info,
            'is_publish' => $request->is_publish,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Info $info)
    {
        $info->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
