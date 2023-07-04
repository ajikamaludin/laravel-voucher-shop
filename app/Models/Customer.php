<?php

namespace App\Models;

use App\Models\Traits\UserTrackable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class Customer extends Authenticatable
{
    use HasFactory, HasUlids, UserTrackable, SoftDeletes;

    const NOT_VERIFIED = 0;

    const VERIFIED = 1;

    const IN_VERICATION = 2;

    const STATUS_INACTIVE = 0;

    const STATUS_ACTIVE = 1;

    const STATUS_SUSPEND = 2;

    const STATUS = [
        self::STATUS_INACTIVE => 'Belum Aktif',
        self::STATUS_ACTIVE => 'Aktif',
        self::STATUS_SUSPEND => 'Suspend/Block',
    ];

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
        'poin_balance',
        'identity_verified',
        'identity_image',
        'customer_level_id',
        'google_oauth_response',
        'poin_expired_at',
        'status',
    ];

    protected $hidden = [
        'password',
        'google_oauth_reponse',
    ];

    protected $appends = [
        'image_url',
        'identity_image_url',
        'display_deposit',
        'display_poin',
        'display_phone',
        'paylater_remain',
        'paylater_limit',
        'paylater_usage',
        'is_allow_paylater',
        'verification_status',
        'status_text',
        'poin_expired_text',
    ];

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            if ($customer->customer_level_id == '') {
                $basic = CustomerLevel::where('key', CustomerLevel::BASIC)->first();

                $customer->customer_level_id = $basic->id;
                $customer->referral_code = Str::upper(Str::random(6));

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

    public function identityImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->identity_image != null) {
                    return asset($this->identity_image);
                }

                return asset('sample/ktp_placeholder.png');
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
            return number_format($this->deposit_balance, is_float($this->deposit_balance) ? 2 : 0, ',', '.');
        });
    }

    public function displayPoin(): Attribute
    {
        return Attribute::make(get: function () {
            return number_format($this->poin_balance, is_float($this->poin_balance) ? 2 : 0, ',', '.');
        });
    }

    public function paylaterUsage(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->is_allow_paylater) {
                return $this->paylater->usage;
            }

            return '';
        });
    }

    public function paylaterRemain(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->is_allow_paylater) {
                return $this->paylater->limit - $this->paylater->usage;
            }

            return '';
        });
    }

    public function paylaterLimit(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->is_allow_paylater) {
                return $this->paylater->limit;
            }

            return '';
        });
    }

    public function isAllowPaylater(): Attribute
    {
        return Attribute::make(get: function () {
            return [CustomerLevel::GOLD => true, CustomerLevel::PLATINUM => true][$this->level->key] ?? false;
        });
    }

    public function verificationStatus(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                self::VERIFIED => 'Terverifikasi',
                self::IN_VERICATION => 'Menunggu Verifikasi',
                self::NOT_VERIFIED => 'Tidak Terverifikasi',
            ][$this->identity_verified];
        });
    }

    public function statusText(): Attribute
    {
        return Attribute::make(get: function () {
            return self::STATUS[$this->status];
        });
    }

    public function poinExpiredText(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->poin_expired_at != null) {
                $date = Carbon::parse($this->poin_expired_at)->translatedFormat('d F Y');

                return "poin kadaluarsa pada $date";
            }

            return 'informasi masa kadaluarsan poin';
        });
    }

    public function allowTransaction(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->status == self::STATUS_SUSPEND) {
                return false;
            }

            return true;
        });
    }

    public function isProfileComplate(): Attribute
    {
        return Attribute::make(get: function () {
            if (in_array(null, [
                $this->username,
                $this->email,
                $this->name,
                $this->fullname,
                $this->address,
                $this->phone,
            ])) {
                return false;
            }
            if (in_array('', [
                $this->username,
                $this->email,
                $this->name,
                $this->fullname,
                $this->address,
                $this->phone,
            ])) {
                return false;
            }

            return true;
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

    public function poins()
    {
        return $this->hasMany(PoinHistory::class);
    }

    public function paylater()
    {
        return $this->hasOne(PaylaterCustomer::class, 'customer_id', 'id');
    }

    public function paylaterHistories()
    {
        return $this->hasMany(PaylaterHistory::class);
    }

    public function paylaterTenorHistories()
    {
        return $this->hasMany(PaylaterTenorHistory::class);
    }

    public function customerRefferals()
    {
        return $this->hasMany(CustomerRefferal::class);
    }

    public function carts()
    {
        return $this->hasMany(CustomerCart::class);
    }

    public function locationFavorites()
    {
        return $this->belongsToMany(Location::class, CustomerLocationFavorite::class);
    }

    public function partner()
    {
        return $this->hasOne(CustomerAsDataPartner::class);
    }
}
