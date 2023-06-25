<?php

namespace App\Models;

use App\Services\GeneralService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Sale extends Model
{
    const PAYED_WITH_MIDTRANS = 'midtrans';

    const PAYED_WITH_MANUAL = 'manual';

    const PAYED_WITH_DEPOSIT = 'deposit';

    const PAYED_WITH_PAYLATER = 'paylater';

    const PAYED_WITH_POIN = 'poin';

    protected $fillable = [
        'code',
        'customer_id',
        'date_time',
        'amount',
        'payed_with',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
    ];

    protected $appends = [
        'format_human_created_at',
        'format_created_at',
        'display_amount',
    ];

    protected static function booted(): void
    {
        static::creating(function (Sale $model) {
            if ($model->code == null) {
                $model->code = GeneralService::generateSaleVoucherCode();
            }
        });
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function formatHumanCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->translatedFormat('d F Y');
        });
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->translatedFormat('d F Y H:i:s');
        });
    }

    public function displayAmount(): Attribute
    {
        return Attribute::make(get: function () {
            return 'Rp' . number_format($this->amount, is_float($this->amount) ? 2 : 0, ',', '.');
        });
    }

    public function create_notification()
    {
        if ($this->payed_with == self::PAYED_WITH_POIN) {
            Notification::create([
                'entity_type' => User::class,
                'description' => $this->customer->fullname . ' melakukan penukaran ' . $this->items()->count() . ' voucher sebesar ' . $this->items->value('price') . ' poin',
            ]);

            Notification::create([
                'entity_id' => auth()->id(),
                'description' => 'Transaksi ' . $this->code . ' berhasil',
            ]);

            return;
        }

        Notification::create([
            'entity_type' => User::class,
            'description' => $this->customer->fullname . ' melakukan pembelian ' . $this->items()->count() . ' voucher sebesar ' . $this->display_amount,
        ]);

        Notification::create([
            'entity_id' => auth()->id(),
            'description' => 'Transaksi pembelian anda ' . $this->code . ' sebesar ' . $this->display_amount . ' berhasil',
        ]);
    }
}
