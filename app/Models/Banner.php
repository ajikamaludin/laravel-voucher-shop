<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Banner extends Model
{
    protected $fillable = [
        'image',
        'title',
        'description',
        'destination',
        'type',
    ];

    protected $appends = [
        'image_url'
    ];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(get: function () {
            return asset($this->image);
        });
    }
}
