<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Voucher extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location_id',
        'username',
        'password',
        'price', // harga jual
        'discount',
        'display_price', //yang di input user
        'quota',
        'profile',
        'comment',
        'expired',
        'expired_unit',
        'is_sold', //menandakan sudah terjual atau belum 
        // batch pada saat import , jadi ketika user ingin beli akan tetapi sudah sold , 
        // maka akan dicarikan voucher lain dari batch yang sama
        'batch_id',
    ];

    protected $appends = ['display_quota'];

    protected static function booted(): void
    {
        static::creating(function (Voucher $voucher) {
            if ($voucher->batch_id == '') {
                $voucher->batch_id = Str::ulid();
            }
            if ($voucher->price == '') {
                $price = $voucher->display_price;
                if ($voucher->discount > 0) {
                    $price = $voucher->display_price - round($voucher->display_price * ($voucher->discount / 100), 2);
                }

                $voucher->price = $price;
            }
        });

        static::updating(function (Voucher $voucher) {
            $price = $voucher->display_price;
            if ($voucher->discount > 0) {
                $price = $voucher->display_price - round($voucher->display_price * ($voucher->discount / 100), 2);
            }

            $voucher->price = $price;
        });
    }

    public function displayQuota(): Attribute
    {
        return Attribute::make(get: function () {
            return round($this->quota / (1024 * 1024 * 1024), 2) . ' GB';
        });
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
