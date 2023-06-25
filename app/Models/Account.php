<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Account extends Model
{
    protected $fillable = [
        'name',
        'bank_name',
        'holder_name',
        'account_number',
        'logo',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected function logoUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return asset($this->logo);
        });
    }
}
