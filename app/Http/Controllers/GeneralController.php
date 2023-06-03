<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GeneralController extends Controller
{
    public function index()
    {
        return inertia('Dashboard');
    }

    public function maintance()
    {
        return inertia('Maintance');
    }

    public function upload(Request $request)
    {
        $request->validate(['image' => 'required|file']);
        $file = $request->file('image');
        $file->store('uploads', 'public');

        return response()->json([
            'id' => Str::ulid(),
            'name' => $file->getClientOriginalName(),
            'url' => asset($file->hashName('uploads')),
        ]);
    }
}
