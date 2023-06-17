<?php

namespace App\Models;

class CustomerLocationFavorite extends Model
{
    protected $fillable = [
        'customer_id',
        'location_id',
    ];
}
