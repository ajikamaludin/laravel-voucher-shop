<?php

namespace App\Models;

class CustomerCart extends Model
{
    protected $fillable = [
        'customer_id',
        'sale_id',
        'entity_type',
        'entity_id',
        'price',
        'quantity',
        'additional_info_json',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'entity_id');
    }
}
