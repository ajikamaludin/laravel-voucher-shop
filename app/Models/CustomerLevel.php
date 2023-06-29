<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class CustomerLevel extends Model
{
    const BASIC = 'basic';

    const SILVER = 'silver';

    const GOLD = 'gold';

    const PLATINUM = 'platinum';

    const MUST_VERIFIED = [self::GOLD, self::PLATINUM];

    const LEVELS = [
        self::BASIC,
        self::SILVER,
        self::GOLD,
        self::PLATINUM,
    ];

    protected $fillable = [
        'name',
        'description',
        'key',
        'logo',
        'min_amount',
        'max_amount',
        'max_loan',
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

    public static function getByKey($key)
    {
        return CustomerLevel::where('key', $key)->first();
    }
}
