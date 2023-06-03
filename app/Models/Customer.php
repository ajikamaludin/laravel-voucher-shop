<?php

namespace App\Models;

use App\Models\Traits\UserTrackable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Str;

class Customer extends Authenticatable
{
    use HasFactory, HasUlids, UserTrackable, SoftDeletes;

    protected $fillable = [
        'username',
        'email',
        'password',
        'name',
        'fullname',
        'address',
        'phone',
        'image',
        'referral_code',
        'google_id',
        'deposit_balance',
        'coin_balance',
        'paylater_balance',
        'identity_verified',
        'identity_image',
        'customer_level_id',
        'google_oauth_response',
    ];

    protected $hidden = [
        'password',
        'google_oauth_reponse',
    ];

    protected $appends = [
        'image_url',
        'display_deposit',
        'display_coin',
        'display_phone',
    ];

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            if ($customer->customer_level_id == '') {
                $basic = CustomerLevel::where('key', CustomerLevel::BASIC)->first();

                $customer->customer_level_id = $basic->id;
                $customer->referral_code = Str::random(6);

                CustomerLevelHistory::create([
                    'customer_id' => $customer->id,
                    'customer_level_id' => $basic->id,
                    'date_time' => now(),
                ]);
            }
        });

        static::updating(function (Customer $customer) {
            if ($customer->isDirty('customer_level_id')) {
                $level = CustomerLevel::find($customer->customer_level_id);

                $customer->customer_level_id = $level->id;

                CustomerLevelHistory::create([
                    'customer_id' => $customer->id,
                    'customer_level_id' => $level->id,
                    'date_time' => now(),
                ]);
            }
        });
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->google_id != null && $this->image == null) {
                    $user = json_decode($this->google_oauth_response);

                    return $user?->avatar;
                }

                if ($this->image != null) {
                    return asset($this->image);
                }

                return asset('sample/avatar.svg');
            }
        );
    }

    public function displayPhone(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->phone === null) {
                return ' - ';
            }

            return '+62' . $this->phone;
        });
    }

    public function displayDeposit(): Attribute
    {
        return Attribute::make(get: function () {
            return number_format($this->deposit_balance, 0, ',', '.');
        });
    }

    public function displayCoin(): Attribute
    {
        return Attribute::make(get: function () {
            return number_format($this->coin_balance, 0, ',', '.');
        });
    }

    public function level()
    {
        return $this->belongsTo(CustomerLevel::class, 'customer_level_id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function deposites()
    {
        return $this->hasMany(DepositHistory::class);
    }
}
