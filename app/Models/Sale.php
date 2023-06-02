<?php

namespace App\Models;

class Sale extends Model
{
    const PAYED_WITH_MIDTRANS = 'midtrans';

    const PAYED_WITH_MANUAL = 'manual';

    const PAYED_WITH_DEPOSIT = 'deposit';

    const PAYED_WITH_COIN = 'coin';

    protected $fillable = [
        'customer_id',
        'date_time',
        'amount',
        'payed_with',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
    ];
}
