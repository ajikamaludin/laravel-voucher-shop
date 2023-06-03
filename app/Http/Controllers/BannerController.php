<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        $query = Banner::orderBy('updated_at', 'desc')->paginate();

        return inertia('Banner/Index', [
            'query' => $query,
        ]);
    }

    public function create()
    {
        return inertia('Banner/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $file = $request->file('image');
        $file->store('uploads', 'public');

        Banner::create([
            'image' => $file->hashName('uploads'),
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('banner.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(Banner $banner)
    {
        return inertia('Banner/Form', [
            'banner' => $banner,
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'image' => 'nullable|image',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $banner->image = $file->hashName('uploads');
        }

        $banner->update([
            'image' => $banner->image,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('banner.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return redirect()->route('banner.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
