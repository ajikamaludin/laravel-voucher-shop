<?php

namespace App\Models;

class CoinReward extends Model
{
    protected $fillable = [
        'amount_buy',
        'bonus_coin',
        'customer_level_id',
    ];

    public function level()
    {
        return $this->belongsTo(CustomerLevel::class, 'customer_level_id');
    }
}
