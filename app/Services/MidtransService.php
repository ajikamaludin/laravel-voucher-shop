<?php

namespace App\Services;

use App\Models\DepositHistory;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    protected $deposit;

    public function __construct(DepositHistory $deposit, $serverKey)
    {
        Config::$serverKey = $serverKey;
        Config::$isProduction = app()->isProduction();
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $this->deposit = $deposit;
    }

    public function getSnapToken()
    {
        $params = [
            'transaction_details' => [
                'order_id' => $this->deposit->id,
                'gross_amount' => $this->deposit->debit,
            ],
            'item_details' => [[
                'id' => $this->deposit->id,
                'price' => $this->deposit->debit,
                'quantity' => 1,
                'name' => $this->deposit->description,
            ]],
            'customer_details' => [
                'name' => $this->deposit->customer->fullname,
                'email' => $this->deposit->customer->email,
                'phone' => $this->deposit->customer->phone,
                'address' => $this->deposit->customer->address,
            ],
            'callbacks' => [
                'finish' => route('customer.deposit.show', ['deposit' => $this->deposit->id])
            ]
        ];

        $snapToken = Snap::getSnapToken($params);

        return $snapToken;
    }
}
