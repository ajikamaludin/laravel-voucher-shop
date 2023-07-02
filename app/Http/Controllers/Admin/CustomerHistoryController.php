<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepositHistory;
use App\Models\PaylaterHistory;
use App\Models\PaylaterTenorHistory;
use App\Models\Sale;

class CustomerHistoryController extends Controller
{
    public function deposit(Customer $customer)
    {
        $query = DepositHistory::with(['editor'])
            ->where('customer_id', $customer->id)
            ->where('type', DepositHistory::TYPE_DEPOSIT)
            ->orderBy('created_at', 'desc');

        return inertia('CustomerHistory/DepositHistory', [
            'query' => $query->paginate(),
            'customer' => $customer,
        ]);
    }

    public function sale(Customer $customer)
    {
        $query = Sale::where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc');

        return inertia('CustomerHistory/SaleHistory', [
            'query' => $query->paginate(),
            'customer' => $customer,
        ]);
    }

    public function paylater(Customer $customer)
    {
        $query = PaylaterHistory::with(['editor'])
            ->where('customer_id', $customer->id)
            ->where('type', PaylaterHistory::TYPE_REPAYMENT)
            ->orderBy('created_at', 'desc');

        return inertia('CustomerHistory/PaylaterHistory', [
            'query' => $query->paginate(),
            'customer' => $customer,
        ]);
    }

    public function paylater_limit(Customer $customer)
    {
        $query = PaylaterHistory::with(['creator'])
            ->where('type', PaylaterHistory::TYPE_UPGRADE)
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc');

        return inertia('CustomerHistory/PaylaterLimitHistory', [
            'query' => $query->paginate(),
            'customer' => $customer,
        ]);
    }

    public function paylater_deadline(Customer $customer)
    {
        $query = PaylaterTenorHistory::with(['creator'])
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc');

        return inertia('CustomerHistory/PaylaterTenorHistory', [
            'query' => $query->paginate(),
            'customer' => $customer,
        ]);
    }
}
