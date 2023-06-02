<?php

namespace App\Models;

class Info extends Model
{
    const TYPE_URL = 'URL';

    protected $fillable = [
        'title',
        'destination',
        'type',
        'is_publish',
    ];
}
