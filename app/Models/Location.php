<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Location extends Model
{
    protected $fillable = [
        'name',
        'description',
        'logo',
    ];

    public function profiles()
    {
        return $this->hasMany(LocationProfile::class);
    }

    public function countVouchers(): Attribute
    {
        return Attribute::make(get: function () {
            $profiles = $this->profiles()->select('id', 'min_stock')->get();
            $minStock = $profiles->min('min_stock');
            $profileIds = $profiles->pluck('id')->toArray();
            $unsoldCount = Voucher::whereIn('location_profile_id', $profileIds)
                ->where('is_sold', Voucher::UNSOLD)
                ->count();

            return [
                'color' => $unsoldCount <= $minStock ? 'bg-red-200 border-red-500' : 'bg-green-200 border-green-500',
                'unsold_count' => $unsoldCount,
            ];
        });
    }
}
