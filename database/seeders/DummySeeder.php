<?php

namespace Database\Seeders;

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
    }

    public function info()
    {
        Info::create([
            'title' => 'Welcome to our new site',
            'is_publish' => 1,
        ]);
    }
}
