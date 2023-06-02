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
            ['key' => 'AFFILATE_ENABLE', 'value' => '0', 'type' => 'checkbox'],
            ['key' => 'AFFILATE_AMOUNT', 'value' => '0', 'type' => 'text'],

            ['key' => 'MIDTRANS_SERVER_KEY', 'value' => 'SB-Mid-server-UA0LQbY4aALV0CfLLX1v7xs8', 'type' => 'text'],
            ['key' => 'MIDTRANS_CLIENT_KEY', 'value' => 'SB-Mid-client-xqqkspzoZOM10iUG', 'type' => 'text'],
            ['key' => 'MIDTRANS_MERCHANT_ID', 'value' => 'G561244367', 'type' => 'text'],

            //
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }

    public function customer_levels()
    {
        $levels = [
            ['name' => 'Basic', 'key' => 'basic'],
            ['name' => 'Silver', 'key' => 'silver'],
            ['name' => 'Gold', 'key' => 'gold'],
            ['name' => 'Platinum', 'key' => 'platinum'],
        ];

        foreach ($levels as $level) {
            CustomerLevel::create($level);
        }
    }
}
