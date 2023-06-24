<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DepositLocation;
use App\Services\GeneralService;
use Illuminate\Http\Request;

class DepositLocationController extends Controller
{
    public function index()
    {
        $query = DepositLocation::orderBy('updated_at', 'desc');

        return inertia('DepositLocation/Index', [
            'query' => $query->paginate()
        ]);
    }

    public function create()
    {
        return inertia('DepositLocation/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'gmap_url' => 'required|url',
            'image' => 'required|image',
            'description' => 'nullable|string',
            'open_hour' => 'required|string',
            'close_hour' => 'required|string',
            'is_active' => 'required|in:0,1',
        ]);

        $file = $request->file('image');
        $file->store('uploads', 'public');

        DepositLocation::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'gmap_url' => $request->gmap_url,
            'image' => $file->hashName('uploads'),
            'description' => $request->description,
            'open_hour' => GeneralService::parserToHour($request->open_hour),
            'close_hour' => GeneralService::parserToHour($request->close_hour),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('deposit-location.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function edit(DepositLocation $location)
    {
        return inertia('DepositLocation/Form', [
            'location' => $location
        ]);
    }

    public function update(Request $request, DepositLocation $location)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'gmap_url' => 'required|url',
            'image' => 'nullable|image',
            'description' => 'nullable|string',
            'open_hour' => 'required|string',
            'close_hour' => 'required|string',
            'is_active' => 'required|in:0,1',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $location->image = $file->hashName('uploads');
        }

        $location->update([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'gmap_url' => $request->gmap_url,
            'image' => $location->image,
            'description' => $request->description,
            'open_hour' => GeneralService::parserToHour($request->open_hour),
            'close_hour' => GeneralService::parserToHour($request->close_hour),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('deposit-location.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(DepositLocation $location)
    {
        $location->delete();

        return redirect()->route('deposit-location.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
