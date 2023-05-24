<?php

namespace App\Models;

class Banner extends Model
{
    protected $fillable = [
        'image',
        'title',
        'description',
        'destination',
        'type',
    ];
}
