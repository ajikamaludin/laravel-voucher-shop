<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class DepositHistory extends Model
{
    const STATUS_VALID = 0;

    const STATUS_WAIT_UPLOAD = 1;

    const STATUS_WAIT_APPROVE = 2;

    const STATUS_WAIT_PAYMENT = 3;

    const STATUS_INVALID = 4;

    const STATUS_REJECT = 5;

    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
        'related_type',
        'related_id',
        'is_valid',
        'image_prove',
        'account_id',
        'payment_token',
        'payment_status',
        'payment_response',
        'payment_channel',
        'payment_type',
    ];

    protected $appends = [
        'status',
        'format_human_created_at',
        'format_created_at',
        'amount',
        'image_prove_url'
    ];

    public function status(): Attribute
    {
        return Attribute::make(get: function () {
            return [
                self::STATUS_VALID => ['text' => 'Success', 'color' => 'bg-green-600'],
                self::STATUS_WAIT_UPLOAD => ['text' => 'Upload bukti transfer', 'color' => 'bg-red-600'],
                self::STATUS_WAIT_APPROVE => ['text' => 'Menunggu Approve', 'color' => 'bg-green-600'],
                self::STATUS_WAIT_PAYMENT => ['text' => 'Menunggu Pembayaran', 'color' => 'bg-green-600'],
                self::STATUS_INVALID => ['text' => 'Error', 'color' => 'bg-red-600'],
                self::STATUS_REJECT => ['text' => 'Reject', 'color' => 'bg-red-600'],
            ][$this->is_valid];
        });
    }

    public function formatHumanCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->locale('id')->format('d F Y');
        });
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->locale('id')->format('d M Y H:i:s');
        });
    }

    public function amount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->credit == 0) {
                return $this->debit;
            }
            return $this->credit;
        });
    }

    public function imageProveUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return $this->image_prove == null ? '' : asset($this->image_prove);
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function update_customer_balance()
    {
        $customer = Customer::find($this->customer_id);
        $customer->update(['deposit_balance' => $customer->deposit_balance + $this->debit]);
    }
}
