<?php

namespace App\Models;


class Account extends Model
{
    protected $fillable = [
        'name',
        'bank_name',
        'holder_name',
        'account_number',
    ];
}
