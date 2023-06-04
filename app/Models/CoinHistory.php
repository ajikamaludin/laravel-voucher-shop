<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class CoinHistory extends Model
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
            return Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y');
        });
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y H:i:s');
        });
    }


    public function amount(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->credit == 0) {
                return number_format($this->debit, 0, ',', '.');
            }

            return number_format($this->credit, 0, ',', '.');
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function update_customer_balance()
    {
        $customer = Customer::find($this->customer_id);
        $customer->update(['coin_balance' => $customer->coin_balance + $this->debit - $this->credit]);
    }
}
