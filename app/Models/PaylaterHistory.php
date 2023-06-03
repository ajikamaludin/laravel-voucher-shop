<?php

namespace App\Models;

class PaylaterHistory extends Model
{
    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
    ];
}
