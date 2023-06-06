<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Sale extends Model
{
    const PAYED_WITH_MIDTRANS = 'midtrans';

    const PAYED_WITH_MANUAL = 'manual';

    const PAYED_WITH_DEPOSIT = 'deposit';

    const PAYED_WITH_PAYLATER = 'paylater';

    const PAYED_WITH_COIN = 'coin';

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
            return Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y');
        });
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y H:i:s');
        });
    }

    public function displayAmount(): Attribute
    {
        return Attribute::make(get: function () {
            return 'Rp' . number_format($this->amount, 0, ',', '.');
        });
    }

    public function create_notification()
    {
        Notification::create([
            'entity_type' => User::class,
            'description' => $this->customer->fullname . ' melakukan pembelian ' . $this->items()->count() . ' voucher sebesar ' . $this->display_amount,
        ]);

        Notification::create([
            'entity_id' => auth()->id(),
            'description' => 'Transaksi pembelian anda #' . $this->code . ' sebesar ' . $this->display_amount . ' berhasil',
        ]);
    }
}
