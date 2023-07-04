<?php

namespace App\Models;

use App\Events\NotificationEvent;
use App\Services\GeneralService;
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
        'validate_price_poin',
        'validate_bonus_poin',
        'discount',
        'status',
        'created_at_formated',
    ];

    private static $instance = [];

    private static function getInstance()
    {
        if (count(self::$instance) == 0) {
            self::$instance = [
                'customer' => Customer::find(auth()->guard('customer')->id()),
            ];
        }

        return self::$instance;
    }

    public function locationProfile()
    {
        return $this->belongsTo(LocationProfile::class, 'location_profile_id');
    }

    public function validatePrice(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->locationProfile->prices->count() > 0) {
                $price = $this->locationProfile->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];

                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('price');
                }

                return $price->max('price');
            }

            return $this->locationProfile->price;
        });
    }

    public function validateDisplayPrice(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->locationProfile->prices->count() > 0) {
                $price = $this->locationProfile->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];

                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('display_price');
                }

                return $price->max('display_price');
            }

            return $this->locationProfile->display_price;
        });
    }

    public function validateBonusPoin(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->locationProfile->prices->count() > 0) {
                $price = $this->locationProfile->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];

                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('bonus_poin');
                }

                return $price->max('bonus_poin');
            }

            return $this->locationProfile->bonus_poin;
        });
    }

    public function validatePricePoin(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->locationProfile->prices->count() > 0) {
                $price = $this->locationProfile->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];

                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('price_poin');
                }

                return $price->max('price_poin');
            }

            return $this->locationProfile->price_poin;
        });
    }

    public function discount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->locationProfile->prices->count() > 0) {
                $price = $this->locationProfile->prices;
                if (auth()->guard('customer')->check()) {
                    $customer = self::getInstance()['customer'];

                    return $price->where('customer_level_id', $customer->customer_level_id)
                        ->value('discount');
                }

                return $price->min('discount');
            }

            return $this->locationProfile->discount;
        });
    }

    public function status(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                'color' => $this->is_sold == self::SOLD ? 'bg-green-200 border-green-600' : 'bg-yellow-100 border-yellow-300',
                'text' => $this->is_sold == self::SOLD ? 'Ya' : 'Tidak',
            ];
        });
    }

    public function createdAtFormated(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->created_at->format('d/m/Y H:i:s');
        });
    }

    public function check_stock_notification()
    {
        $count = Voucher::where([
            ['is_sold', '=', self::UNSOLD],
            ['location_profile_id', '=', $this->location_profile_id],
        ])->count();

        $treshold = $this->locationProfile->min_stock;

        if ($count <= $treshold) {
            $notification = Notification::create([
                'entity_type' => User::class,
                'description' => 'stok voucher ' . $this->locationProfile->name . ' (' . $this->locationProfile->location->name . ') ' . ' tersisa : ' . $count,
                'url' => route('voucher.profile', $this->locationProfile->location_id),
                'type' => Notification::TYPE_VOUCHER_STOCK,
            ]);

            NotificationEvent::dispatch([
                'id' => $notification->id,
                'description' => $notification->description,
                'url' => $notification->url,
                'type' => Notification::TYPE_VOUCHER_STOCK,
                'format_created_at' => now()->translatedFormat('d F Y H:i:s'),
                'stock_notifications' => Notification::where('entity_type', User::class)
                    ->where('type', Notification::TYPE_VOUCHER_STOCK)
                    ->where('is_read', Notification::UNREAD)->limit(10)
                    ->orderBy('created_at', 'desc')
                    ->get(),
            ]);
        }
    }

    public static function stats(Location $location)
    {
        $locationCallback = fn ($q) => $q->where('location_id', $location->id);
        $count_voucher_total = Voucher::whereHas('locationProfile', $locationCallback)->count();

        $sum_voucher_total = Voucher::whereHas('locationProfile', $locationCallback)
            ->join('location_profiles', 'location_profiles.id', '=', 'vouchers.location_profile_id')
            ->selectRaw('(sum(location_profiles.price)) as total')
            ->value('total');

        $count_voucher_sold = Voucher::whereHas('locationProfile', $locationCallback)
            ->where('is_sold', Voucher::SOLD)->count();
        $count_voucher_unsold = Voucher::whereHas('locationProfile', $locationCallback)
            ->where('is_sold', Voucher::UNSOLD)->count();
        $sum_voucher_unsold = Voucher::whereHas('locationProfile', $locationCallback)
            ->where('is_sold', Voucher::UNSOLD)
            ->join('location_profiles', 'location_profiles.id', '=', 'vouchers.location_profile_id')
            ->selectRaw('(sum(location_profiles.price)) as total')
            ->value('total');

        $sum_voucher_sold = SaleItem::whereHas('voucher', function ($q) use ($locationCallback) {
            return $q->whereHas('locationProfile', $locationCallback);
        })
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

    public function create_bonus_poin(Customer $customer)
    {
        $bonus = $this->validate_bonus_poin;

        if ($bonus > 0) {
            $customer = Customer::find($customer->id);
            $poin = $customer->poins()->create([
                'debit' => $bonus,
                'description' => GeneralService::generateBonusPoinCode(),
                'narration' => 'Bonus Poin Pembelian Voucher',
            ]);

            $poin->update_customer_balance();
        }
    }
}
