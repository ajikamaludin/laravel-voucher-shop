<?php

namespace Database\Seeders;

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
}
