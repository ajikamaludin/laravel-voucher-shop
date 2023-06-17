<?php

namespace App\Models;

class CashDepositLocation extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone',
        'gmap_url',
        'image',
        'description',
        'open_hour',
        'close_hour',
        'is_active',
    ];
}
