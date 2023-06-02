<?php

namespace App\Models;

class DepositHistory extends Model
{
    const VALID = 0;

    const WAIT = 1;

    const INVALID = 2;

    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
        'related_type',
        'related_id',
        'is_valid',
        'image_prove',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
    ];
}
