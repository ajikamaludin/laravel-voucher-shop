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
            ['key' => 'AFFILATE_ENABLED', 'value' => '0', 'type' => 'checkbox'],
            ['key' => 'AFFILATE_COIN_AMOUNT', 'value' => '0', 'type' => 'text'],

            ['key' => 'MIDTRANS_SERVER_KEY', 'value' => 'SB-Mid-server-UA0LQbY4aALV0CfLLX1v7xs8', 'type' => 'text'],
            ['key' => 'MIDTRANS_CLIENT_KEY', 'value' => 'SB-Mid-client-xqqkspzoZOM10iUG', 'type' => 'text'],
            ['key' => 'MIDTRANS_MERCHANT_ID', 'value' => 'G561244367', 'type' => 'text'],
            ['key' => 'MIDTRANS_LOGO', 'value' => 'sample/midtrans_logo.png', 'type' => 'image'],
            ['key' => 'MIDTRANS_ENABLED', 'value' => '0', 'type' => 'text'],
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
