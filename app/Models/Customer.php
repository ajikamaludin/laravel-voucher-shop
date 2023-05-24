<?php

namespace App\Models;

class Customer extends Model
{
    protected $fillable = [
        'email',
        'password',
        'name',
        'fullname',
        'address',
        'phone',
        'image',
        'referral_code',
        'google_id',
        'deposit_balance',
        'coin_balance',
        'identity_verified',
        'identity_image',
    ];
}
