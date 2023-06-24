<?php

namespace Database\Seeders;

use App\Models\CustomerLevel;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class InstallationSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->settings();
        $this->customer_levels();
    }

    public function settings()
    {
        $settings = [
            // general
            ['key' => 'OPEN_WEBSITE_NAME', 'value' => 'Welcome to Voucher App', 'type' => 'text'],
            ['key' => 'SHARE_TEXT', 'value' => '<p>Baru Beli Voucher nih</p>', 'type' => 'text'],

            // affilate
            ['key' => 'AFFILATE_ENABLED', 'value' => '0', 'type' => 'checkbox'],
            ['key' => 'AFFILATE_POIN_AMOUNT', 'value' => '0', 'type' => 'text'],
            ['key' => 'AFFILATE_DOWNLINE_POIN_AMOUNT', 'value' => '0', 'type' => 'text'],
            ['key' => 'AFFILATE_SHARE_REFFERAL_CODE', 'value' => 'Yuk daftar dapatkan bonus poin', 'type' => 'text'],
            ['key' => 'AFFILATE_ALLOWED_LEVELS', 'value' => json_encode([]), 'type' => 'json'],

            // midtrans
            ['key' => 'MIDTRANS_SERVER_KEY', 'value' => 'SB-Mid-server-UA0LQbY4aALV0CfLLX1v7xs8', 'type' => 'text'],
            ['key' => 'MIDTRANS_CLIENT_KEY', 'value' => 'SB-Mid-client-xqqkspzoZOM10iUG', 'type' => 'text'],
            ['key' => 'MIDTRANS_MERCHANT_ID', 'value' => 'G561244367', 'type' => 'text'],
            ['key' => 'MIDTRANS_LOGO', 'value' => 'sample/midtrans_logo.png', 'type' => 'image'],
            ['key' => 'MIDTRANS_ENABLED', 'value' => '1', 'type' => 'text'],
            ['key' => 'MIDTRANS_ADMIN_FEE', 'value' => '2500', 'type' => 'text'],

            // deposit
            ['key' => 'ENABLE_CASH_DEPOSIT', 'value' => '1', 'type' => 'text'], // deposit by location (on/off)
            ['key' => 'TEXT_CASH_DEPOSIT', 'value' => 'Setor Tunai di Kantor WBB', 'type' => 'text'],
            ['key' => 'ENABLE_MANUAL_TRANSFER', 'value' => '1', 'type' => 'text'], // transfer manual (on/off)
            ['key' => 'MAX_MANUAL_TRANSFER_TIMEOUT', 'value' => '2', 'type' => 'text'], // dalam jam
            ['key' => 'MANUAL_TRANSFER_OPEN_HOUR', 'value' => '00:00', 'type' => 'text'],
            ['key' => 'MANUAL_TRANSFER_CLOSE_HOUR', 'value' => '23:59', 'type' => 'text'],
            ['key' => 'MAX_POINT_EXPIRED', 'value' => '90', 'type' => 'text'], //dalam hari
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }

    public function customer_levels()
    {
        $levels = [
            [
                'name' => 'Basic',
                'key' => 'basic',
                'logo' => 'sample/basic.png',
                'description' => '<p><span style="font-size: 18pt;"><strong>&nbsp;Level Ini Basic&nbsp;</strong></span></p>
                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>
                <pre>&nbsp; 1. contoh 1</pre>
                <pre>&nbsp; 2. contoh 2</pre>
                <p>&nbsp;</p>',
                'min_amount' =>
                '100000',
                'max_amount' => '500000'
            ],
            [
                'name' => 'Silver',
                'key' => 'silver',
                'logo' => 'sample/silver.png',
                'description' => '<p><span style="font-size: 18pt;"><strong>&nbsp;Level Ini Silver&nbsp;</strong></span></p>
                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>
                <pre>&nbsp; 1. contoh 1</pre>
                <pre>&nbsp; 2. contoh 2</pre>
                <p>&nbsp;</p>',
                'min_amount' => '100000',
                'max_amount' => '1000000'
            ],
            [
                'name' => 'Gold',
                'key' => 'gold',
                'logo' => 'sample/gold.png',
                'description' => '<p><span style="font-size: 18pt;"><strong>&nbsp;Level Ini Gold&nbsp;</strong></span></p>
                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>
                <pre>&nbsp; 1. contoh 1</pre>
                <pre>&nbsp; 2. contoh 2</pre>
                <p>&nbsp;</p>',
                'min_amount' => '100000',
                'max_amount' => '2000000'
            ],
            [
                'name' => 'Platinum',
                'key' => 'platinum',
                'logo' => 'sample/platinum.png',
                'description' => '<p><span style="font-size: 18pt;"><strong>&nbsp;Level Ini Platinum&nbsp;</strong></span></p>
                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>
                <pre>&nbsp; 1. contoh 1</pre>
                <pre>&nbsp; 2. contoh 2</pre>
                <p>&nbsp;</p>',
                'min_amount' => '100000',
                'max_amount' => '3000000'
            ],
        ];

        foreach ($levels as $level) {
            CustomerLevel::create($level);
        }
    }
}
