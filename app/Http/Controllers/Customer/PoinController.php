<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\PoinHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PoinController extends Controller
{
    public function index(Request $request)
    {
        $poins = PoinHistory::where('customer_id', auth()->id())
            ->orderBy('description', 'desc')
            ->orderBy('updated_at', 'desc');

        $start_date = now()->startOfMonth();
        $end_date = now()->endOfMonth();
        if ($request->startDate != '' && $request->endDate != '') {
            $start_date = Carbon::parse($request->startDate);
            $end_date = Carbon::parse($request->endDate);
        }

        $poins->whereBetween('created_at', [$start_date, $end_date]);

        return inertia('Poin/Index', [
            'poins' => $poins->paginate(20),
            '_start_date' => $start_date->format('m/d/Y'),
            '_end_date' => $end_date->format('m/d/Y'),
        ]);
    }

    public function show(PoinHistory $poin)
    {
        return inertia('Poin/Detail', [
            'poin' => $poin,
        ]);
    }
}
