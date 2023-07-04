<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerLevel;
use App\Models\Location;
use App\Models\PaylaterCustomer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerMitraController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_mitra' => Customer::whereHas('level', function ($q) {
                return $q->where('key', CustomerLevel::GOLD)
                    ->orWhere('key', CustomerLevel::PLATINUM);
            })->count(),
            'blocked_mitra' => Customer::whereHas('level', function ($q) {
                return $q->where('key', CustomerLevel::GOLD)
                    ->orWhere('key', CustomerLevel::PLATINUM);
            })
                ->where('status', Customer::STATUS_SUSPEND)
                ->count(),
            'active_mitra' => Customer::whereHas('level', function ($q) {
                return $q->where('key', CustomerLevel::GOLD)
                    ->orWhere('key', CustomerLevel::PLATINUM);
            })
                ->where('status', '!=', Customer::STATUS_SUSPEND)
                ->count(),
            'sum_paylater_limit' => PaylaterCustomer::sum('limit'),
            'sum_paylater_usage' => PaylaterCustomer::sum('usage'),
            'sum_paylater_remain' => PaylaterCustomer::selectRaw('(SUM("limit") - SUM("usage")) as remain')->value('remain'),
        ];

        $query = Customer::query()->with(['level', 'paylater', 'locationFavorites'])
            ->whereHas('level', function ($q) {
                $q->where('key', CustomerLevel::GOLD)
                    ->orWhere('key', CustomerLevel::PLATINUM);
            });

        if ($request->q != '') {
            $query->where(function ($query) use ($request) {
                $query->where('name', 'ilike', "%$request->q%")
                    ->orWhere('fullname', 'ilike', "%$request->q%")
                    ->orWhere('email', 'ilike', "%$request->q%")
                    ->orWhere('phone', 'ilike', "%$request->q%");
            });
        }

        if ($request->location_ids != '') {
            $query->whereHas('locationFavorites', fn ($q) => $q->whereIn('id', $request->location_ids));
        }

        if ($request->levels != '') {
            $query->whereIn('customer_level_id', $request->levels);
        }

        $sortBy = 'updated_at';
        $sortRule = 'desc';
        if ($request->sortBy != '' && $request->sortRule != '') {
            $sortBy = $request->sortBy;
            $sortRule = $request->sortRule;
        }

        $query->orderBy($sortBy, $sortRule);

        return inertia('CustomerMitra/Index', [
            'query' => $query->paginate(),
            'stats' => $stats,
            'levels' => CustomerLevel::all(),
            '_search' => $request->q,
            '_sortBy' => $sortBy,
            '_sortOrder' => $sortRule,
        ]);
    }

    public function create(Request $request)
    {
        $levels = CustomerLevel::where('key', CustomerLevel::GOLD)
            ->orWhere('key', CustomerLevel::PLATINUM)
            ->get();

        $locations = Location::query();

        if ($request->location_q != '') {
            $locations->where('name', 'ilike', "%$request->location_q%");
        }

        return inertia('CustomerMitra/Form', [
            'levels' => $levels,
            'statuses' => Customer::STATUS,
            'locations' => $locations->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'nullable|email|unique:customers,email',
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username',
            'password' => 'required|string|min:8',
            'name' => 'required|string',
            'fullname' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|numeric',
            'image' => 'nullable|image',
            'identity_image' => 'nullable|image',
            //
            'level' => 'required|exists:customer_levels,key',
            'paylater_limit' => 'required|numeric',
            'day_deadline' => 'required|numeric|max:365',
            //
            'id_number' => 'nullable|string',
            'job' => 'nullable|string',
            'image_selfie' => 'nullable|image',
            'file_statement' => 'nullable|file',
            'file_agreement' => 'nullable|file',
            'items' => 'nullable|array',
            'items.*.name' => 'nullable|string',
            'items.*.type' => 'required|in:text,file',
            'items.*.value' => 'nullable|string',
            'locations' => 'nullable|array',
            'locations.*.id' => 'nullable|exists:locations,id',
        ]);

        $level = CustomerLevel::where('key', $request->level)->first();

        DB::beginTransaction();
        $customer = Customer::make([
            'email' => $request->email,
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'name' => $request->name,
            'fullname' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'status' => $request->status,
            'customer_level_id' => $level->id,
            'identity_verified' => $request->hasFile('identity_image') ? Customer::VERIFIED : Customer::NOT_VERIFIED,
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        if ($request->hasFile('identity_image')) {
            $file = $request->file('identity_image');
            $file->store('uploads', 'public');
            $customer->identity_image = $file->hashName('uploads');
        }

        $customer->save();

        foreach (collect($request->locations) as $location) {
            $customer->locationFavorites()->attach($location['id']);
        }

        $customer->paylater()->create([
            'limit' => $request->paylater_limit,
            'day_deadline' => $request->day_deadline,
        ]);

        $partner = $customer->partner()->create([
            'id_number' => $request->id_number,
            'job' => $request->job,
            'additional_json' => json_encode($request->items ?? []),
        ]);

        if ($request->hasFile('image_selfie')) {
            $file = $request->file('image_selfie');
            $file->store('uploads', 'public');
            $partner->update(['image_selfie' => $file->hashName('uploads')]);
        }

        if ($request->hasFile('file_statement')) {
            $file = $request->file('file_statement');
            $file->store('uploads', 'public');
            $partner->update(['file_statement' => $file->hashName('uploads')]);
        }

        if ($request->hasFile('file_agreement')) {
            $file = $request->file('file_agreement');
            $file->store('uploads', 'public');
            $partner->update(['file_agreement' => $file->hashName('uploads')]);
        }
        DB::commit();

        return redirect()->route('mitra.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed created']);
    }

    public function edit(Request $request, Customer $customer)
    {
        $levels = CustomerLevel::where('key', CustomerLevel::GOLD)
            ->orWhere('key', CustomerLevel::PLATINUM)
            ->get();

        $locations = Location::query();

        if ($request->location_q != '') {
            $locations->where('name', 'ilike', "%$request->location_q%");
        }

        return inertia('CustomerMitra/Form', [
            'customer' => $customer->load(['paylater', 'partner', 'locationFavorites']),
            'levels' => $levels,
            'statuses' => Customer::STATUS,
            'locations' => $locations->paginate(10),

        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'username' => 'required|string|min:5|alpha_dash|unique:customers,username,' . $customer->id,
            'password' => 'nullable|string|min:8',
            'name' => 'required|string',
            'fullname' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|numeric',
            'image' => 'nullable|image',
            'identity_image' => 'nullable|image',
            //
            'level' => 'required|exists:customer_levels,key',
            'paylater_limit' => 'required|numeric',
            'day_deadline' => 'required|numeric',
            //
            'id_number' => 'nullable|string',
            'job' => 'nullable|string',
            'image_selfie' => 'nullable|image',
            'file_statement' => 'nullable|file',
            'file_agreement' => 'nullable|file',
            'items' => 'nullable|array',
            'items.*.name' => 'nullable|string',
            'items.*.type' => 'required|in:text,file',
            'items.*.value' => 'nullable|string',
        ]);

        $level = CustomerLevel::where('key', $request->level)->first();

        DB::beginTransaction();
        $customer->fill([
            'email' => $request->email,
            'username' => $request->username,
            'name' => $request->name,
            'fullname' => $request->fullname,
            'address' => $request->address,
            'phone' => $request->phone,
            'status' => $request->status,
            'customer_level_id' => $level->id,
            'identity_verified' => $request->hasFile('identity_image') ? Customer::VERIFIED : Customer::NOT_VERIFIED,
        ]);

        if ($request->password != '') {
            $customer->password = bcrypt($request->password);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $file->store('uploads', 'public');
            $customer->image = $file->hashName('uploads');
        }

        if ($request->hasFile('identity_image')) {
            $file = $request->file('identity_image');
            $file->store('uploads', 'public');
            $customer->identity_image = $file->hashName('uploads');
        }

        $customer->save();

        $customer->locationFavorites()->detach();
        foreach (collect($request->locations) as $location) {
            $customer->locationFavorites()->attach($location['id']);
        }

        $customer->paylater()->updateOrCreate([
            'customer_id' => $customer->id,
        ], [
            'limit' => $request->paylater_limit,
            'day_deadline' => $request->day_deadline,
        ]);

        $partner = $customer->partner()->updateOrCreate([
            'customer_id' => $customer->id,
        ], [
            'id_number' => $request->id_number,
            'job' => $request->job,
            'additional_json' => json_encode($request->items ?? []),
        ]);

        if ($request->hasFile('image_selfie')) {
            $file = $request->file('image_selfie');
            $file->store('uploads', 'public');
            $partner->update(['image_selfie' => $file->hashName('uploads')]);
        }

        if ($request->hasFile('file_statement')) {
            $file = $request->file('file_statement');
            $file->store('uploads', 'public');
            $partner->update(['file_statement' => $file->hashName('uploads')]);
        }

        if ($request->hasFile('file_agreement')) {
            $file = $request->file('file_agreement');
            $file->store('uploads', 'public');
            $partner->update(['file_agreement' => $file->hashName('uploads')]);
        }
        DB::commit();

        return redirect()->route('mitra.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('mitra.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
