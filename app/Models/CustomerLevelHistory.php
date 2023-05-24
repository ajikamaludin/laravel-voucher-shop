<?php

namespace App\Models;

class CustomerLevelHistory extends Model
{
    protected $fillable = [
        'customer_id',
        'customer_level_id',
        'date_time',
    ];
}
