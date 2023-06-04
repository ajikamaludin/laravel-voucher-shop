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

    public function shareWord(): Attribute
    {
        return Attribute::make(get: function () {
            $string = "Hai, aku baru beli voucher {$this->voucher->location->name} di " . route('home.index');
            $string .= " voucher {$this->voucher->display_quota} buat {$this->voucher->display_expired}

Username : {$this->voucher->username}
Password : {$this->voucher->password}

";
            $string .= "Cuman Rp" . number_format($this->price, '0', ',', '.') . " aja, ";

            if ($this->voucher->discount > 0) {
                $string .= "lagi ada discount {$this->voucher->discount}% loh.
";
            }

            $string .= "dapatkat penawaran voucher lainnya di " . route('home.index');

            return $string;
        });
    }
}
