<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class LocationProfile extends Model
{
    const EXPIRED_HOUR = 'Jam';

    const EXPIRED_DAY = 'Hari';

    const EXPIRED_WEEK = 'Minggu';

    const EXPIRED_MONTH = 'Bulan';

    const EXPIRED_UNIT = [
        self::EXPIRED_HOUR,
        self::EXPIRED_DAY,
        self::EXPIRED_WEEK,
        self::EXPIRED_MONTH,
    ];

    protected $fillable = [
        'location_id',
        'name',
        'quota',
        'display_note',
        'expired',
        'expired_unit',
        'description',
        'min_stock',
        'price',
        'display_price',
        'discount',
        'price_poin',
        'bonus_poin',
    ];

    protected $appends = [
        'diplay_expired',
    ];

    protected static function booted(): void
    {
        static::creating(function (LocationProfile $model) {
            $price = $model->display_price;
            if ($model->discount > 0) {
                $price = $price - ($price * ($model->discount / 100));
            }
            $model->price = $price;
        });

        static::updating(function (LocationProfile $model) {
            $price = $model->display_price;
            if ($model->discount > 0) {
                $price = $price - ($price * ($model->discount / 100));
            }
            $model->price = $price;
        });
    }

    public function prices()
    {
        return $this->hasMany(LocationProfilePrice::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function diplayExpired(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->expired . ' ' . $this->expired_unit;
        });
    }

    public function countVouchers(): Attribute
    {
        return Attribute::make(get: function () {
            $unsoldCount = $this->vouchers()->where('is_sold', Voucher::UNSOLD)->count();

            return [
                'color' => $unsoldCount <= $this->min_stock ? 'bg-red-200 border-red-500' : 'bg-green-200 border-green-500',
                'unsold_count' => $unsoldCount,
            ];
        });
    }
}
