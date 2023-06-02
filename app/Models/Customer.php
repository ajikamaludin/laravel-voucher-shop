<?php

namespace App\Models;

use App\Models\Traits\UserTrackable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

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
    ];

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
}
