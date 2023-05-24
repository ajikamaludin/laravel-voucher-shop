<?php

namespace App\Models;

class Notification extends Model
{
    protected $fillable = [
        'entity_type',
        'entity_id',
        'description',
        'is_read',
    ];
}
