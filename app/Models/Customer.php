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
        'google_oauth_response'
    ];

    protected $hidden = [
        'password',
        'google_oauth_reponse'
    ];

    protected $appends = [
        'image_url',
    ];

    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->google_id != null) {
                    $image = explode('-', $this->images);
                    if ($image[0] == "IMAGE") {
                        return $image[1];
                    }
                }

                if ($this->image != null) {
                    return $this->asset($this->image);
                }

                return asset('sample/avatar.svg');
            }
        );
    }
}
