<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'entity_type',
        'entity_id',
        'price',
        'quantity',
        'additional_info_json',
    ];

    protected $appends = [
        'share_word',
    ];

    public function related()
    {
        return $this->belongsTo($this->entity_type, 'entity_id');
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'entity_id');
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function shareWord(): Attribute
    {
        return Attribute::make(get: function () {
            $shareText = Setting::getByKey('SHARE_TEXT').'
Kode Voucher : ' . $this->voucher->username;

            return $shareText;
        });
    }
}
