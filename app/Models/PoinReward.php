<?php

namespace App\Models;

class PoinReward extends Model
{
    protected $fillable = [
        'amount_buy',
        'bonus_poin',
        'customer_level_id',
    ];

    public function level()
    {
        return $this->belongsTo(CustomerLevel::class, 'customer_level_id');
    }
}
