<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class PaylaterHistory extends Model
{
    protected $fillable = [
        'debit',
        'credit',
        'description',
        'customer_id',
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
        $paylater->update(['usage' => $paylater->usage + $this->debit - $this->credit]);
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
