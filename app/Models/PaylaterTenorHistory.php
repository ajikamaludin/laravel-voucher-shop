<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class PaylaterTenorHistory extends Model
{
    protected $fillable = [
        'customer_id',
        'day_deadline',
        'file_agreement',
        'description',
    ];

    protected $appends = ['format_created_at', 'file_agreement_url'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->translatedFormat('d F Y H:i:s');
        });
    }

    public function fileAgreementUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return asset($this->file_agreement);
        });
    }
}
