<?php

namespace App\Models;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'entity_type',
        'entity_id',
        'price',
        'quantity',
        'additional_info_json',
    ];

    public function related()
    {
        return $this->belongsTo($this->entity_type, 'entity_id');
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'entity_id');
    }
}
