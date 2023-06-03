<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Banner;
use App\Models\Info;
use App\Models\Location;
use App\Models\Voucher;
use App\Services\GeneralService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
        $this->location();
        $this->voucher();
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

    public function location()
    {
        $locations = ['Jarbriel.id', 'Shaff.net', 'Weslycamp.net', 'Glory.net', 'Salgo.id', 'Terna.id', 'Kanza.id'];

        foreach ($locations as $location) {
            Location::create([
                'name' => $location,
                'description' => '-'
            ]);
        }
    }

    public function voucher()
    {

        $vouchers = GeneralService::script_parser(file_get_contents(public_path('example.md')));


        DB::beginTransaction();
        foreach ([1, 2] as $loop) {
            $batchId = Str::ulid();
            $location = Location::get()[$loop];

            foreach ($vouchers as $voucher) {
                Voucher::create([
                    'location_id' => $location->id,
                    'username' => $voucher['username'],
                    'password' => $voucher['password'],
                    'discount' => $loop == 1 ? 10 : 0,
                    'display_price' => $loop == 1 ? 100000 : 99000,
                    'quota' => $voucher['quota'],
                    'profile' => $voucher['profile'],
                    'comment' => $voucher['comment'],
                    'expired' => 30,
                    'expired_unit' => 'Hari',
                    'batch_id' => $batchId,
                ]);
            }
        }
        DB::commit();
    }
}
