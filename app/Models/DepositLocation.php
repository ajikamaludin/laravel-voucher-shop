<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class DepositLocation extends Model
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

    protected $appends = [
        'image_url',
        'operational_hour',
    ];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return asset($this->image);
        });
    }

    protected function operationalHour(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->open_hour.' - '.$this->close_hour;
        });
    }
}
