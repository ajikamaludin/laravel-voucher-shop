<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Banner;
use App\Models\Info;
use Illuminate\Database\Seeder;

class DummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->info();
        $this->banner();
        $this->account();
    }

    public function info()
    {
        Info::create([
            'title' => 'Welcome to our new site',
            'is_publish' => 1,
        ]);
    }

    public function banner()
    {
        $images = ['1.webp', '2.webp', '3.webp'];
        foreach ($images as $index => $image) {
            Banner::create([
                'title' => 'Banner ' . $index,
                'image' => 'sample/' . $image,
                'description' => '<h1>Banner </h1>'
            ]);
        }
    }

    public function account()
    {
        $banks = [
            ['name' => 'BRI', 'bank_name' => 'Bank Rakyat Indonesia', 'holder_name' => 'Aji Kamaludin', 'account_number' => '187391738129'],
            ['name' => 'Jago', 'bank_name' => 'Bank Jago', 'holder_name' => 'Aji Kamaludin', 'account_number' => '718297389172']
        ];

        foreach ($banks as $bank) {
            Account::create([
                'name' => $bank['name'],
                'bank_name' => $bank['bank_name'],
                'holder_name' => $bank['holder_name'],
                'account_number' => $bank['account_number'],
            ]);
        }
    }
}
