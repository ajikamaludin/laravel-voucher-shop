<?php

namespace App\Models;

class CoinHistory extends Model
{
    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
        'related_type',
        'related_id',
    ];
}
