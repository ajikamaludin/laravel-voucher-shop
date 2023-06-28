<?php

namespace App\Models;

class PaylaterCustomer extends Model
{
    protected $fillable = [
        'limit',
        'usage',
        'description',
        'customer_id',
        'day_deadline',
        'day_deadline_at'
    ];

    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'id');
    }
}
