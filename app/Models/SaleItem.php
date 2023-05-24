<?php

namespace App\Models;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'entity_type',
        'entity_id',
        'price',
        'additional_info_json',
    ];
}
