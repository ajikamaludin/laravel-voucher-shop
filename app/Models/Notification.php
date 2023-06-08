<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Notification extends Model
{
    const UNREAD = 0;

    const READ = 1;

    protected $fillable = [
        'entity_type',
        'entity_id',
        'description',
        'is_read',
    ];

    protected $appends = [
        'format_created_at',
    ];

    public function mark_as_read()
    {
        $this->update(['is_read' => self::READ]);
    }

    public function mark_all_as_read()
    {
        Notification::where('is_read', self::UNREAD)->where('entity_type', User::class)->update(['is_read' => self::READ]);
    }

    public function formatCreatedAt(): Attribute
    {
        return Attribute::make(get: function () {
            return Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y H:i:s');
        });
    }
}
