<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Location::orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $query->where('name', 'like', "%$request->q%");
        }

        return inertia('Location/Index', [
            'query' => $query->paginate(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|image',
        ]);

        $logo = null;
        if ($request->hasFile('midtrans_logo_file')) {
            $file = $request->file('midtrans_logo_file');
            $file->store('uploads', 'public');
            $logo = $file->hashName('uploads');
        }

        Location::create([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $logo,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Location $location)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|image',
        ]);

        if ($request->hasFile('midtrans_logo_file')) {
            $file = $request->file('midtrans_logo_file');
            $file->store('uploads', 'public');
            $location->logo = $file->hashName('uploads');
        }

        $location->update([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $location->logo,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Location $location)
    {
        $location->delete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
