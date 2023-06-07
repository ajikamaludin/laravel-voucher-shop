<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        $total_voucher = Voucher::count();
        $total_customer = Customer::count();
        $total_customer_verified = Customer::where('identity_verified', Customer::VERIFIED)->count();
        $total_deposit = DepositHistory::where('is_valid', DepositHistory::STATUS_VALID)->sum('debit');

        $month = now()->locale('id')->translatedFormat('F');
        $startOfMonth = now()->startOfMonth()->format('m/d/Y');
        $endOfMonth = now()->endOfMonth()->format('m/d/Y');
        $total_voucher_sale_this_month = SaleItem::whereBetween(DB::raw("strftime('%m/%d/%Y', created_at)"), [$startOfMonth, $endOfMonth])
            ->sum('price');
        $count_voucher_sale_this_month = SaleItem::whereBetween(DB::raw("strftime('%m/%d/%Y', created_at)"), [$startOfMonth, $endOfMonth])
            ->sum('quantity');
        $total_voucher_sale_this_day = SaleItem::whereDate('created_at', now()->format('Y-m-d'))
            ->sum('price');
        $count_voucher_sale_this_day = SaleItem::whereDate('created_at', now()->format('Y-m-d'))
            ->sum('quantity');

        $deposites = DepositHistory::whereDate('created_at', now()->format('Y-m-d'))
            ->where('is_valid', DepositHistory::STATUS_VALID)
            ->where('debit', '!=', '0')
            ->groupBy('customer_id')
            ->orderBy('updated_at', 'desc')
            ->with('customer')
            ->limit(20)
            ->selectRaw('sum(debit) as total, is_valid, customer_id')
            ->get();

        $sales = SaleItem::whereDate('sale_items.created_at', now()->format('Y-m-d'))
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('customers', 'customers.id', '=', 'sales.customer_id')
            ->groupBy('sales.customer_id')
            ->orderBy('sale_items.updated_at', 'desc')
            ->limit(20)
            ->selectRaw('sum(sale_items.price) as total, sum(quantity) as count, sales.customer_id, customers.name, entity_id')
            ->get();

        // charts
        $startDate = now()->startOfMonth()->format('m/d/Y');
        $endDate = now()->endOfMonth()->format('m/d/Y');
        if ($request->start_date != '') {
            $startDate = Carbon::parse($request->start_date)->format('m/d/Y');
        }
        if ($request->end_date != '') {
            $endDate = Carbon::parse($request->end_date)->format('m/d/Y');
        }
        $charts = Sale::selectRaw("SUM(amount) as sale_total, strftime('%d/%m/%Y', date_time) as date")
            ->whereBetween(DB::raw("strftime('%m/%d/%Y', date_time)"), [$startDate, $endDate])
            ->orderBy('date_time', 'asc')
            ->groupBy(DB::raw("strftime('%m/%d/%Y', date_time)"));

        // filter lokasi 
        if ($request->location_id != '') {
            $charts->whereHas('items', function ($q) use ($request) {
                $q->join('vouchers', 'vouchers.id', '=', 'sale_items.entity_id')
                    ->where('vouchers.location_id', $request->location_id);
            });
        }

        // filter customer
        if ($request->customer_id != '') {
            $charts->where('customer_id', $request->customer_id);
        }

        $ca = [];
        $date = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $data = $charts->get();
        while ($date <= $end) {
            $da = $data->where('date', $date->format('d/m/Y'))?->value('sale_total') ?? 0;
            $ca[] = ['sale_total' => $da, 'date' => $date->format('d/m/Y')];
            $date = $date->addDay();
        }

        return inertia('Dashboard', [
            'total_voucher' => $total_voucher,
            'total_customer' => $total_customer,
            'total_customer_verified' => $total_customer_verified,
            'total_deposit' => $total_deposit,
            'total_voucher_sale_this_month' => $total_voucher_sale_this_month,
            'count_voucher_sale_this_month' => $count_voucher_sale_this_month,
            'total_voucher_sale_this_day' => $total_voucher_sale_this_day,
            'count_voucher_sale_this_day' => $count_voucher_sale_this_day,
            'month' => $month,
            'deposites' => $deposites,
            'sales' => $sales,
            'charts' => $ca,
            '_startDate' => $startDate,
            '_endDate' => $endDate,
            'c' => $charts,
            'd' => $data,
        ]);
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
