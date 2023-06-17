<?php

namespace App\Models;

class Voucher extends Model
{
    const UNSOLD = 0;

    const SOLD = 1;

    protected $fillable = [
        'name',
        'description',
        'location_profile_id',
        'username',
        'password',
        'quota',
        'profile',
        'comment',
        'is_sold', //menandakan sudah terjual atau belum
    ];

    protected $appends = ['display_quota', 'display_expired', 'validate_price', 'validate_display_price'];

    public function shuffle_unsold()
    {
        $voucher = Voucher::where([
            ['is_sold', '=', self::UNSOLD],
            ['batch_id', '=', $this->batch_id],
        ])->first();

        return $voucher;
    }

    public function count_unsold()
    {
        $voucher = Voucher::where([
            ['is_sold', '=', self::UNSOLD],
            ['batch_id', '=', $this->batch_id],
        ])->count();

        return $voucher;
    }

    public function check_stock_notification()
    {
        $count = Voucher::where([
            ['is_sold', '=', self::UNSOLD],
            ['batch_id', '=', $this->batch_id],
        ])->count();

        $treshold = Setting::getByKey('VOUCHER_STOCK_NOTIFICATION');

        if ($count <= $treshold) {
            Notification::create([
                'entity_type' => User::class,
                'description' => 'stok voucher '.$this->location->name.' ( '.$this->profile.' ) '.'tersisa : '.$count,
            ]);
        }
    }
}
