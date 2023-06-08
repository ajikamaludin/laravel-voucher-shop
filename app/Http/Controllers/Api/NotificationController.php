<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function update(Notification $notif)
    {
        if ($notif->id == null) {
            (new Notification)->mark_all_as_read();

            return;
        }
        $notif->mark_as_read();
    }
}
