<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $query = Notification::where('entity_type', \App\Models\User::class)
            ->orderBy('is_read', 'asc')
            ->orderBy('created_at', 'desc');

        return inertia('Notification/Index', [
            'query' => $query->paginate(),
        ]);
    }
}
