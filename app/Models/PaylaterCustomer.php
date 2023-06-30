<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class PaylaterCustomer extends Model
{
    protected $fillable = [
        'limit',
        'usage',
        'description',
        'customer_id',
        'day_deadline',
        'day_deadline_at',
    ];

    protected $appends = [
        'paylater_description'
    ];

    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'id');
    }

    public function paylaterDescription(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->day_deadline_at != null) {
                $deadlineAt = Carbon::parse($this->day_deadline_at)->translatedFormat('d F Y');
                return "lunasi pinjaman kamu sebelum jatuh tempo pada {$deadlineAt}";
            }

            return "yuk gunakan terus saldo yang tersedia";
        });
    }
}
