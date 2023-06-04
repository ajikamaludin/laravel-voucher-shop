<?php

namespace App\Models;

class PaylaterCustomer extends Model
{
    protected $fillable = [
        'limit',
        'usage',
        'description',
        'customer_id',
    ];
}
