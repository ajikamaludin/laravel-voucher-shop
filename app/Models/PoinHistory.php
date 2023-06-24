<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class PoinHistory extends Model
{
    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
        'related_type',
        'related_id',
    ];

    protected $appends = [
        'amount',
        'format_human_created_at',
        'format_created_at',
    ];

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
                return number_format($this->debit, is_float($this->debit) ? 2 : 0, ',', '.');
            }

            return number_format($this->credit, is_float($this->credit) ? 2 : 0, ',', '.');
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function update_customer_balance()
    {
        $customer = Customer::find($this->customer_id);
        $customer->update(['poin_balance' => $customer->poin_balance + $this->debit - $this->credit]);
    }
}
