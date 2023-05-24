<?php

namespace App\Models;

class VoucherPrice extends Model
{
    protected $fillable = [
        'customer_level_id',
        'voucher_id',
        'price',
    ];
}
