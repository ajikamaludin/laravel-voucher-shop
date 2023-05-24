<?php

namespace App\Models;

class Voucher extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location_id',
        'username',
        'password',
        'price',
        'discount',
        'display_price',
        'quota',
        'profile',
        'comment',
        'expired',
    ];
}
