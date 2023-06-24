<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Banner;
use App\Models\CustomerLevel;
use App\Models\DepositHistory;
use App\Models\DepositLocation;
use App\Models\Info;
use App\Models\Location;
use App\Models\LocationProfile;
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
        $this->location_profile();
        $this->voucher();
        $this->deposit_location();
    }

    public function info()
    {
        Info::create([
            'title' => 'Welcome to our new site',
            'description' => '
                <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">Info: Welcome to new WBB site, <span style="text-decoration: underline;"><a href="http://google.com" target="_blank" rel="noopener">klik disini</a></span></div>
            ',
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
                'description' => '<h1>Banner </h1>',
            ]);
        }
    }

    public function account()
    {
        $banks = [
            ['name' => 'BTPN', 'bank_name' => 'BTPN', 'holder_name' => 'Aji Kamaludin', 'account_number' => '187391738129', 'logo' => 'sample/logo-jenius.png', 'admin_fee' => 0],
            ['name' => 'Jago', 'bank_name' => 'Bank Jago', 'holder_name' => 'Aji Kamaludin', 'account_number' => '718297389172', 'logo' => 'sample/logo-jago.png', 'admin_fee' => 2500],
            ['name' => 'BNI', 'bank_name' => 'Bank Negara Indoneisa', 'holder_name' => 'Aji Kamaludin', 'account_number' => '718297389172', 'logo' => 'sample/logo-bni.png', 'admin_fee' => 6500],
        ];

        foreach ($banks as $bank) {
            Account::create([
                'name' => $bank['name'],
                'bank_name' => $bank['bank_name'],
                'holder_name' => $bank['holder_name'],
                'account_number' => $bank['account_number'],
                'logo' => $bank['logo'],
                'admin_fee' => $bank['admin_fee']
            ]);
        }
    }

    public function location()
    {
        $locations = [
            'jabriel.id', 'shaff.net', 'weslycamp.net', 'glory.net', 'agelos.net', 'brigton.ne', 'tairon.net', 'jeconia.net', 'metsawifi.net', 'donata.net', 'hoptar.id', 'salgo.id', 'feivel.id', 'carenet.id', 'ivena.id', 'dishan.id', 'imago.id', 'netif.id', 'gavi.id', 'terna.id', 'kanza.id', 'benaya.id', 'rega.id', 'ponix.id', 'drago.id', 'lexsa.id', 'kilia.id', 'gramanta.id', 'vermil.id', 'nohea.id', 'ducan.id', 'letra.id', 'lejau.id', 'jelivan', 'takahiro.id', 'katsu', 'zergan', 'satoshi',
        ];

        foreach ($locations as $location) {
            Location::create([
                'name' => Str::ucfirst($location),
                'description' => '-',
            ]);
        }
    }

    public function location_profile()
    {
        $profiles = [
            LocationProfile::EXPIRED_DAY => '1 GB',
            LocationProfile::EXPIRED_WEEK => '2 GB',
            LocationProfile::EXPIRED_MONTH => '99 GB',
        ];

        $count = 0;
        $locations = Location::orderBy('name', 'asc')->limit(3)->get();
        foreach ($locations as $location) { //ada 3 lokasi di tiap lokasi ada 3 profile
            $count += 1;
            foreach ($profiles as $expired => $quota) {
                $disply_price = 10000;
                $discount = $expired == LocationProfile::EXPIRED_DAY ? 0 : 10;

                $price = $disply_price - ($disply_price * ($discount / 100));

                $lp = LocationProfile::create([
                    'location_id' => $location->id,
                    'name' => 'Profile ' . $quota,
                    'quota' => $quota,
                    'display_note' => rand(0, 1) == 1 ? 'bisa semua' : null,
                    'expired' => rand(1, 3),
                    'expired_unit' => $expired,
                    'description' => '',
                    'min_stock' => 10,
                    'price' => $price,
                    'display_price' => $disply_price,
                    'discount' => $discount,
                    'price_poin' => $price,
                    'bonus_poin' => 0,
                ]);

                if ($count == 3) {
                    $dp = 100000;
                    $disc = 0;

                    $bp = 0;

                    foreach (CustomerLevel::LEVELS as $index => $level) {
                        if ($index != 0) {
                            $disc += 5;
                        }

                        $p = $dp - ($dp * ($disc / 100));
                        $lp->prices()->create([
                            'customer_level_id' => CustomerLevel::getByKey($level)->id,
                            'price' => $p,
                            'display_price' => $dp,
                            'discount' => $disc,
                            'price_poin' => $p,
                            'bonus_poin' => $bp,
                        ]);
                    }
                }
            }
        }
    }

    public function voucher()
    {

        $vouchers = GeneralService::script_parser(file_get_contents(public_path('example.md')));

        DB::beginTransaction();
        foreach (LocationProfile::limit(9)->get() as $profile) {
            foreach ($vouchers as $voucher) {
                Voucher::create([
                    'location_profile_id' => $profile->id,
                    'username' => $voucher['username'],
                    'password' => $voucher['password'],
                    'quota' => $voucher['quota'],
                    'profile' => $voucher['profile'],
                    'comment' => $voucher['comment'],
                ]);
            }
        }
        DB::commit();
    }

    public function deposit_location()
    {
        DepositLocation::create([
            'name' => 'Location 1',
            'address' => 'Address Lengkap Alamat',
            'phone' => '83840745543',
            'gmap_url' => 'https://goo.gl/maps/iyJ8nq32pJ2BbfUf6',
            'image' => 'sample/banner.jpg',
            'description' => '<h1>lokasi favoorite</h1>',
            'open_hour' => '00:00',
            'close_hour' => '23:59',
            'is_active' => 1,
        ]);

        DepositLocation::create([
            'name' => 'Location 2',
            'address' => 'Address Lengkap Alamat',
            'phone' => '83840745543',
            'gmap_url' => 'https://goo.gl/maps/iyJ8nq32pJ2BbfUf6',
            'image' => 'sample/banner.jpg',
            'description' => '<h1>lokasi favoorite</h1>',
            'open_hour' => '14:00',
            'close_hour' => '18:59',
            'is_active' => 1,
        ]);
    }
}
