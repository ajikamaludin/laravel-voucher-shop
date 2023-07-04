<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class PaylaterHistory extends Model
{
    const STATUS_VALID = 0;

    const STATUS_WAIT_UPLOAD = 1;

    const STATUS_WAIT_APPROVE = 2;

    const STATUS_WAIT_PAYMENT = 3;

    const STATUS_INVALID = 4;

    const STATUS_REJECT = 5;

    const STATUS_EXPIRED = 6;

    const TYPE_PAYMENT = 0;

    const TYPE_UPGRADE = 1;

    const TYPE_REPAYMENT = 3;

    const TYPE_UPDATE_TENOR = 4;

    protected $fillable = [
        'debit',
        'credit',
        'description',
        'note',
        'customer_id',
        'type',
        'is_valid',
        'image_prove',
        'next_payment',
        'not_fullpayment_reason',
    ];

    protected $appends = [
        'format_human_created_at',
        'format_created_at',
        'amount',
        'status',
        'status_text',
    ];

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

    public function amount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->credit == 0) {
                return 'Rp '.number_format($this->debit, is_float($this->debit) ? 2 : 0, ',', '.');
            }

            return '-Rp '.number_format($this->credit, is_float($this->credit) ? 2 : 0, ',', '.');
        });
    }

    public function status(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->type == self::TYPE_REPAYMENT && $this->is_valid == self::STATUS_REJECT) {
                return 'Reject';
            }

            if ($this->type == self::TYPE_REPAYMENT && $this->is_valid == self::STATUS_EXPIRED) {
                return 'Expired';
            }

            if ($this->type == self::TYPE_REPAYMENT && $this->is_valid != self::STATUS_VALID) {
                return 'Menunggu pembayaran';
            }

            return '';
        });
    }

    public function statusText(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                self::STATUS_VALID => ['text' => 'Success', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_WAIT_UPLOAD => ['text' => 'Upload bukti bayar', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_WAIT_APPROVE => ['text' => 'Menunggu Approve', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_WAIT_PAYMENT => ['text' => 'Menunggu Pembayaran', 'color' => 'bg-green-600', 'text_color' => 'text-green-600'],
                self::STATUS_INVALID => ['text' => 'Error', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_REJECT => ['text' => 'Reject', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
                self::STATUS_EXPIRED => ['text' => 'Expired', 'color' => 'bg-red-600', 'text_color' => 'text-red-600'],
            ][$this->is_valid];
        });
    }

    public function create_notification_user()
    {
        Notification::create([
            'entity_id' => $this->customer_id,
            'description' => 'Pembayaran '.$this->description.' sebesar '.$this->amount.' sudah sukses diterima',
        ]);
    }

    public function update_customer_paylater()
    {
        $customer = Customer::find($this->customer_id);
        $paylater = $customer->paylater;

        if ($paylater->day_deadline_at == null) {
            $paylater->day_deadline_at = now()->addDays($paylater->day_deadline);
        }

        $usage = $paylater->usage + $this->debit - $this->credit;

        if ($usage == 0) {
            $paylater->day_deadline_at = null;
        }

        $paylater->update([
            'usage' => $usage,
            'day_deadline_at' => $paylater->day_deadline_at,
        ]);
    }
}
