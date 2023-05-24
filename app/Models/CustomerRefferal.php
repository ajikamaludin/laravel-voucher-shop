<?php

namespace App\Models;

class CustomerRefferal extends Model
{
    protected $fillable = [
        'customer_id',
        'refferal_id',
        'customer_code',
    ];
}
