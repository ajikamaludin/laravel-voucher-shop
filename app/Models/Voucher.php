<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

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

    protected $appends = [
        'validate_price',
        'validate_display_price',
        'status',
        'created_at_formated'
    ];

    public function profile()
    {
        return $this->belongsTo(LocationProfile::class, 'location_profile_id');
    }

    public function validatePrice(): Attribute
    {
        return Attribute::make(get: function () {
            return '';
        });
    }

    public function validateDisplayPrice(): Attribute
    {
        return Attribute::make(get: function () {
            return '';
        });
    }

    public function status(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                'color' => $this->sold == self::SOLD ? 'bg-green-200 border-green-600' : 'bg-yellow-100 border-yellow-300',
                'text' => $this->sold == self::SOLD ? 'Ya' : 'Tidak'
            ];
        });
    }

    public function createdAtFormated(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->created_at->format('d/m/Y H:i:s');
        });
    }

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
                'description' => 'stok voucher ' . $this->location->name . ' ( ' . $this->profile . ' ) ' . 'tersisa : ' . $count,
            ]);
        }
    }

    public static function stats(Location $location)
    {

        $profileIds = LocationProfile::where('location_id', $location->id)->pluck('id')->toArray();

        $count_voucher_total = Voucher::whereIn('location_profile_id', $profileIds)->count();
        $sum_voucher_total = Voucher::whereIn('location_profile_id', $profileIds)
            ->join('location_profiles', 'location_profiles.id', '=', 'vouchers.location_profile_id')
            ->selectRaw('(count(vouchers.id) * location_profiles.price) as total')
            ->value('total');
        $count_voucher_sold = Voucher::whereIn('location_profile_id', $profileIds)->where('is_sold', Voucher::SOLD)->count();
        $count_voucher_unsold = Voucher::whereIn('location_profile_id', $profileIds)->where('is_sold', Voucher::UNSOLD)->count();
        $sum_voucher_unsold = Voucher::whereIn('location_profile_id', $profileIds)
            ->where('is_sold', Voucher::UNSOLD)
            ->join('location_profiles', 'location_profiles.id', '=', 'vouchers.location_profile_id')
            ->selectRaw('(count(vouchers.id) * location_profiles.price) as total')
            ->value('total');

        $voucherIds = Voucher::whereIn('location_profile_id', $profileIds)->pluck('id')->toArray();
        $sum_voucher_sold = SaleItem::whereIn('entity_id', $voucherIds)
            ->whereHas('sale', function ($q) {
                $q->where('payed_with', Sale::PAYED_WITH_DEPOSIT)
                    ->orWhere('payed_with', Sale::PAYED_WITH_PAYLATER);
            })
            ->selectRaw('SUM(price * quantity) as total')
            ->value('total');

        return [
            'count_voucher_total' => $count_voucher_total,
            'sum_voucher_total' => $sum_voucher_total,
            'count_voucher_sold' => $count_voucher_sold,
            'sum_voucher_sold' => $sum_voucher_sold,
            'count_voucher_unsold' => $count_voucher_unsold,
            'sum_voucher_unsold' => $sum_voucher_unsold,
        ];
    }
}
