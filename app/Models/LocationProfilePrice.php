<?php

namespace App\Models;

class LocationProfilePrice extends Model
{
    protected $fillable = [
        'location_profile_id',
        'customer_level_id',
        'price',
        'display_price',
        'discount',
        'price_poin',
        'bonus_poin',
    ];

    protected static function booted(): void
    {
        static::creating(function (LocationProfilePrice $model) {
            $price = $model->display_price;
            if ($model->discount > 0) {
                $price = $price - ($price * ($model->discount / 100));
            }
            $model->price = $price;
        });

        static::updating(function (LocationProfilePrice $model) {
            $price = $model->display_price;
            if ($model->discount > 0) {
                $price = $price - ($price * ($model->discount / 100));
            }
            $model->price = $price;
        });
    }

    public function level()
    {
        return $this->belongsTo(CustomerLevel::class, 'customer_level_id');
    }
}
