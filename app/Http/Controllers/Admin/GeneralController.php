<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DepositHistory;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        $deposites = DepositHistory::whereDate('created_at', now()->format('Y-m-d'))
            ->where('is_valid', DepositHistory::STATUS_VALID)
            ->where('debit', '!=', '0')
            ->groupBy('is_valid', 'customer_id')
            ->orderBy('total', 'desc')
            ->with('customer')
            ->limit(20)
            ->selectRaw('sum(debit) as total, is_valid, customer_id')
            ->get();

        $sales = SaleItem::whereDate('sale_items.created_at', now()->format('Y-m-d'))
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('customers', 'customers.id', '=', 'sales.customer_id')
            ->groupBy('sales.customer_id', 'customers.name', 'entity_id')
            ->orderBy('total', 'desc')
            ->limit(20)
            ->selectRaw('sum(sale_items.price) as total, sum(quantity) as count, sales.customer_id, customers.name, entity_id')
            ->get();

        // charts
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();
        $year = $startDate;
        if ($request->start_date != '') {
            $startDate = Carbon::parse($request->start_date);
        }
        if ($request->end_date != '') {
            $endDate = Carbon::parse($request->end_date);
        }
        if ($request->year != '') {
            $year = Carbon::parse($request->year);
        }

        $saleDepositCharts = Sale::selectRaw('SUM(amount) as sale_total, DATE(date_time) as date')
            ->whereBetween('date_time', [$startDate, $endDate])
            ->where('payed_with', Sale::PAYED_WITH_DEPOSIT)
            ->groupBy(DB::raw('DATE(date_time)'));

        $salePaylaterCharts = Sale::selectRaw('SUM(amount) as sale_total, DATE(date_time) as date')
            ->whereBetween('date_time', [$startDate, $endDate])
            ->where('payed_with', Sale::PAYED_WITH_PAYLATER)
            ->groupBy(DB::raw('DATE(date_time)'));

        // filter lokasi
        if ($request->location_id != '') {
            $saleDepositCharts->whereHas('items', function ($q) use ($request) {
                $q->join('vouchers', 'vouchers.id', '=', 'sale_items.entity_id')
                    ->join('location_profiles', 'vouchers.location_profile_id', '=', 'location_profiles.id')
                    ->where('location_profiles.location_id', $request->location_id);
            });
            $salePaylaterCharts->whereHas('items', function ($q) use ($request) {
                $q->join('vouchers', 'vouchers.id', '=', 'sale_items.entity_id')
                    ->join('location_profiles', 'vouchers.location_profile_id', '=', 'location_profiles.id')
                    ->where('location_profiles.location_id', $request->location_id);
            });
        }

        // filter customer
        if ($request->customer_id != '') {
            $saleDepositCharts->where('customer_id', $request->customer_id);
            $salePaylaterCharts->where('customer_id', $request->customer_id);
        }

        $depositSaleCharts = [];
        $paylaterSaleCharts = [];
        $dates = [];
        $date = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $saleDepositCharts = $saleDepositCharts->get();
        $salePaylaterCharts = $salePaylaterCharts->get();

        while ($date <= $end) {
            if ($request->payment == 'deposit' || $request->payment == '') {
                $sdc = $saleDepositCharts->where('date', $date->format('Y-m-d'))->value('sale_total') ?? 0;
                $depositSaleCharts[] = ['sale_total' => $sdc, 'date' => $date->format('d/m/Y')];
            }

            if ($request->payment == 'paylater' || $request->payment == '') {
                $spc = $salePaylaterCharts->where('date', $date->format('Y-m-d'))->value('sale_total') ?? 0;
                $paylaterSaleCharts[] = ['sale_total' => $spc, 'date' => $date->format('d/m/Y')];
            }

            $dates[] = ['date' => $date->format('d/m/Y')];

            $date = $date->addDay();
        }

        $saleYearDepositCharts = Sale::selectRaw('SUM(amount) as sale_total, MONTH(date_time) as month')
            ->where('payed_with', Sale::PAYED_WITH_DEPOSIT)
            ->whereRaw('YEAR(sales.date_time) = ' . Carbon::parse($year)->year)
            ->groupBy(DB::raw('MONTH(date_time)'));

        $saleYearPaylaterCharts = Sale::selectRaw('SUM(amount) as sale_total, MONTH(date_time) as month')
            ->where('payed_with', Sale::PAYED_WITH_PAYLATER)
            ->whereRaw('YEAR(sales.date_time) = ' . Carbon::parse($year)->year)
            ->groupBy(DB::raw('MONTH(date_time)'));

        // filter lokasi
        if ($request->year_location_id != '') {
            $saleYearDepositCharts->whereHas('items', function ($q) use ($request) {
                $q->join('vouchers', 'vouchers.id', '=', 'sale_items.entity_id')
                    ->join('location_profiles', 'vouchers.location_profile_id', '=', 'location_profiles.id')
                    ->where('location_profiles.location_id', $request->year_location_id);
            });
            $saleYearPaylaterCharts->whereHas('items', function ($q) use ($request) {
                $q->join('vouchers', 'vouchers.id', '=', 'sale_items.entity_id')
                    ->join('location_profiles', 'vouchers.location_profile_id', '=', 'location_profiles.id')
                    ->where('location_profiles.location_id', $request->year_location_id);
            });
        }

        // filter customer
        if ($request->year_customer_id != '') {
            $saleYearDepositCharts->where('customer_id', $request->year_customer_id);
            $saleYearPaylaterCharts->where('customer_id', $request->year_customer_id);
        }

        $saleYearDepositCharts = $saleYearDepositCharts->get();
        $saleYearPaylaterCharts = $saleYearPaylaterCharts->get();

        $depositYearSaleCharts = [];
        $paylaterYearSaleCharts = [];
        $months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $ms = [];
        foreach ($months as $month) {
            if ($request->year_payment == 'deposit' || $request->year_payment == '') {
                $depositYearSaleCharts[] = ['sale_total' => $saleYearDepositCharts->where('month', $month)->value('sale_total') ?? 0, 'month' => $month];
            }
            if ($request->year_payment == 'paylater' || $request->year_payment == '') {
                $paylaterYearSaleCharts[] = ['sale_total' => $saleYearPaylaterCharts->where('month', $month)->value('sale_total') ?? 0, 'month' => $month];
            }
            $ms[] = ['month' => $month];
        }

        return inertia('Dashboard', [
            'deposites' => $deposites,
            'sales' => $sales,
            'sales_deposit_charts' => $depositSaleCharts,
            'sales_paylater_charts' => $paylaterSaleCharts,
            '_dates' => $dates,
            '_startDate' => $startDate,
            '_endDate' => $endDate,
            '_payment' => $request->payment,
            'deposit_year_sale_charts' => $depositYearSaleCharts,
            'paylater_year_sale_charts' => $paylaterYearSaleCharts,
            '_year_payment' => $request->year_payment,
            '_months' => $ms,
            '_year' => $year,
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
