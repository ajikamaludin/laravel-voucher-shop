<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PWAController extends Controller
{
    public function manifest()
    {
        $icons = [
            [
                "src" => "icon-192.png",
                "sizes" => "192x192",
                "type" => "image/png",
                "purpose" => "any"
            ],
            [
                "src" => "icon-192-maskable.png",
                "sizes" => "192x192",
                "type" => "image/png",
                "purpose" => "maskable"
            ],
            [
                "src" => "icon-512.png",
                "sizes" => "512x512",
                "type" => "image/png",
                "purpose" => "any"
            ],
            [
                "src" => "icon-512-maskable.png",
                "sizes" => "512x512",
                "type" => "image/png",
                "purpose" => "maskable"
            ],
        ];

        $data = [
            "name" => "WBB Voucher App",
            "short_name" => "Voucher App",
            "start_url" => '/?direct=1',
            "id" => 'id.ajikamaludin.voucher',
            "scope" => ".",
            "display" => "standalone",
            "background_color" => "#0940c4",
            "theme_color" => "#db1f1f",
            "description" => "Aplikasi Voucher WiFi",
            "orientation" => "portrait",
            "icons" => $icons,
            "prefer_related_applications" => false,
            "display_override" => [
                "standalone",
                "fullscreen",
                "window-controls-overlay"
            ],
            "screenshots" => [
                [
                    "src" => "screenshot_1.png",
                    "sizes" => "1280x800",
                    "type" => "image/png"
                ],
                [
                    "src" => "screenshot_2.png",
                    "sizes" => "750x1334",
                    "type" => "image/png"
                ]
            ],
            "categories" => [
                "productivity",
                "utilities"
            ],
            "dir" => "ltr"
        ];

        return response()->json($data);
    }

    public function assetlinks()
    {
        return response()->json([[
            "relation" => ["delegate_permission/common.handle_all_urls"],
            "target" => [
                "namespace" => "android_app",
                "package_name" => "id.my.itworks.voucher.twa",
                "sha256_cert_fingerprints" => ["58:1C:40:FB:F0:E5:E9:F5:A3:87:13:6D:22:08:3B:A5:68:4E:8F:63:E3:CA:52:70:8F:8A:24:7E:9F:D2:2C:75"]
            ]
        ]]);
    }
}
