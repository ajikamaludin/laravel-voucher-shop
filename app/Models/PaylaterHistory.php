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

    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
        'type',
        'is_valid',
        'image_prove'
    ];

    protected $appends = [
        'format_human_created_at',
        'format_created_at',
        'amount',
    ];

    public function update_customer_paylater()
    {
        $customer = Customer::find($this->customer_id);
        $paylater = $customer->paylater;
        $paylater->update([
            'usage' => $paylater->usage + $this->debit - $this->credit,
            // TODO: add day dateline
        ]);
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
                return 'Rp' . number_format($this->debit, is_float($this->debit) ? 2 : 0, ',', '.');
            }

            return '-Rp' . number_format($this->credit, is_float($this->credit) ? 2 : 0, ',', '.');
        });
    }
}
