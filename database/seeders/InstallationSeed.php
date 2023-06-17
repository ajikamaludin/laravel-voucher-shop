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
            ['key' => 'OPEN_WEBSITE_NAME', 'value' => 'Welcome to Voucher App', 'type' => 'text'],

            ['key' => 'AFFILATE_ENABLED', 'value' => '0', 'type' => 'checkbox'],
            ['key' => 'AFFILATE_POIN_AMOUNT', 'value' => '0', 'type' => 'text'],
            ['key' => 'AFFILATE_DOWNLINE_POIN_AMOUNT', 'value' => '0', 'type' => 'text'],

            ['key' => 'MIDTRANS_SERVER_KEY', 'value' => 'SB-Mid-server-UA0LQbY4aALV0CfLLX1v7xs8', 'type' => 'text'],
            ['key' => 'MIDTRANS_CLIENT_KEY', 'value' => 'SB-Mid-client-xqqkspzoZOM10iUG', 'type' => 'text'],
            ['key' => 'MIDTRANS_MERCHANT_ID', 'value' => 'G561244367', 'type' => 'text'],
            ['key' => 'MIDTRANS_LOGO', 'value' => 'sample/midtrans_logo.png', 'type' => 'image'],
            ['key' => 'MIDTRANS_ENABLED', 'value' => '0', 'type' => 'text'],
            ['key' => 'MIDTRANS_ADMIN_FEE', 'value' => '2500', 'type' => 'text'],

            // ['key' => 'VOUCHER_STOCK_NOTIFICATION', 'value' => '10', 'type' => 'text'],

            ['key' => 'ENABLE_CASH_DEPOSIT', 'value' => '0', 'type' => 'text'],
            ['key' => 'ENABLE_MANUAL_TRANSFER', 'value' => '0', 'type' => 'text'],
            ['key' => 'MAX_MANUAL_TRANSFER_TIMEOUT', 'value' => '2', 'type' => 'text'], //dalam jam
            ['key' => 'MANUAL_TRANSFER_OPEN_HOUR', 'value' => '06:00', 'type' => 'text'],
            ['key' => 'MANUAL_TRANSFER_CLOSE_HOUR', 'value' => '23:00', 'type' => 'text'],
            ['key' => 'MAX_POINT_EXPIRED', 'value' => '90', 'type' => 'text'], //dalam hari
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }

    public function customer_levels()
    {
        $levels = [
            ['name' => 'Basic', 'key' => 'basic', 'description' => '-', 'min_amount' => '100000', 'max_amount' => '500000'],
            ['name' => 'Silver', 'key' => 'silver', 'description' => '-', 'min_amount' => '100000', 'max_amount' => '1000000'],
            ['name' => 'Gold', 'key' => 'gold', 'description' => '-', 'min_amount' => '100000', 'max_amount' => '2000000'],
            ['name' => 'Platinum', 'key' => 'platinum', 'description' => '-', 'min_amount' => '100000', 'max_amount' => '3000000'],
        ];

        foreach ($levels as $level) {
            CustomerLevel::create($level);
        }
    }
}
