<?php

namespace App\Models;

class VoucherPrice extends Model
{
    protected $fillable = [
        'customer_level_id',
        'voucher_id',
        'price',
        'display_price',
    ];

    public function level()
    {
        return $this->belongsTo(CustomerLevel::class, 'customer_level_id');
    }
}
