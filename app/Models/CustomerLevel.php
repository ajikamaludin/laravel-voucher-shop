<?php

namespace App\Models;

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
        'min_amount',
        'max_amount',
        'max_loan',
    ];

    public static function getByKey($key)
    {
        return CustomerLevel::where('key', $key)->first();
    }
}
