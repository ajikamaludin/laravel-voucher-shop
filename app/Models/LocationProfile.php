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
        'display_expired',
        'validate_price',
        'validate_display_price',
        'validate_discount',
        'validate_price_poin',
        'validate_bonus_poin',
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

    private static $instance = [];

    private static function getInstance()
    {
        if (count(self::$instance) == 0) {
            self::$instance = [
                'customer' => Customer::find(auth()->guard('customer')->id())
            ];
        }

        return self::$instance;
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

    public function displayExpired(): Attribute
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

    public function validatePrice(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->prices->count() > 0) {
                $price = $this->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];
                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('price');
                }
                return $price->max('price');
            }
            return $this->price;
        });
    }

    public function validateDisplayPrice(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->prices->count() > 0) {
                $price = $this->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];
                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('display_price');
                }
                return $price->max('display_price');
            }
            return $this->display_price;
        });
    }

    public function validateDiscount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->prices->count() > 0) {
                $price = $this->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];
                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('discount');
                }
                return $price->min('discount');
            }
            return $this->discount;
        });
    }

    public function validateBonusPoin(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->prices->count() > 0) {
                $price = $this->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];
                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('bonus_poin');
                }
                return $price->max('bonus_poin');
            }
            return $this->bonus_poin;
        });
    }

    public function validatePricePoin(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->prices->count() > 0) {
                $price = $this->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];
                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('price_poin');
                }
                return $price->max('price_poin');
            }
            return $this->price_poin;
        });
    }

    public function shuffle_unsold($limit)
    {
        $vouchers = Voucher::where([
            ['is_sold', '=', Voucher::UNSOLD],
            ['location_profile_id', '=', $this->id],
        ])
            ->limit($limit)
            ->get();

        return $vouchers;
    }

    public function count_unsold()
    {
        $voucher = Voucher::where([
            ['is_sold', '=', Voucher::UNSOLD],
            ['location_profile_id', '=', $this->id],
        ])->count();

        return $voucher;
    }
}
