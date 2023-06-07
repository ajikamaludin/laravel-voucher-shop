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
            $item = json_decode($this->additional_info_json);
            $string = "Hai, aku baru beli voucher {$item->voucher->location->name} di " . route('home.index');
            $string .= " voucher {$item->voucher->display_quota} buat {$item->voucher->display_expired}

Username : {$item->voucher->username}
Password : {$item->voucher->password}

";
            $string .= "Cuman Rp" . number_format($this->price, '0', ',', '.') . " aja, ";

            if ($item->voucher->discount > 0) {
                $string .= "lagi ada discount {$item->voucher->discount}% loh.
";
            }

            $string .= "dapatkat penawaran voucher lainnya di " . route('home.index');

            return $string;
        });
    }
}
