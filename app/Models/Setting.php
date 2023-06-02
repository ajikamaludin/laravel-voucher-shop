<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    protected $appends = [
        'url',
    ];

    protected function url(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->type == 'image') {
                return asset($this->value);
            }

            return '';
        });
    }
}
