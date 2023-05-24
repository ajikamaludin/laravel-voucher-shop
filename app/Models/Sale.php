<?php

namespace App\Models;

class Sale extends Model
{
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
