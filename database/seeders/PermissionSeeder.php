<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            ['id' => Str::ulid(), 'label' => 'View Dashboard', 'name' => 'view-dashboard'],

            ['id' => Str::ulid(), 'label' => 'Create Admin', 'name' => 'create-user'],
            ['id' => Str::ulid(), 'label' => 'Update Admin', 'name' => 'update-user'],
            ['id' => Str::ulid(), 'label' => 'View Admin', 'name' => 'view-user'],
            ['id' => Str::ulid(), 'label' => 'Delete Admin', 'name' => 'delete-user'],

            ['id' => Str::ulid(), 'label' => 'Create Rule', 'name' => 'create-role'],
            ['id' => Str::ulid(), 'label' => 'Update Rule', 'name' => 'update-role'],
            ['id' => Str::ulid(), 'label' => 'View Rule', 'name' => 'view-role'],
            ['id' => Str::ulid(), 'label' => 'Delete Rule', 'name' => 'delete-role'],

            ['id' => Str::ulid(), 'label' => 'Create Banner', 'name' => 'create-banner'],
            ['id' => Str::ulid(), 'label' => 'Update Banner', 'name' => 'update-banner'],
            ['id' => Str::ulid(), 'label' => 'View Banner', 'name' => 'view-banner'],
            ['id' => Str::ulid(), 'label' => 'Delete Banner', 'name' => 'delete-banner'],

            ['id' => Str::ulid(), 'label' => 'Create Info', 'name' => 'create-info'],
            ['id' => Str::ulid(), 'label' => 'Update Info', 'name' => 'update-info'],
            ['id' => Str::ulid(), 'label' => 'View Info', 'name' => 'view-info'],
            ['id' => Str::ulid(), 'label' => 'Delete Info', 'name' => 'delete-info'],

            ['id' => Str::ulid(), 'label' => 'Create Voucher', 'name' => 'create-voucher'],
            ['id' => Str::ulid(), 'label' => 'Update Voucher', 'name' => 'update-voucher'],
            ['id' => Str::ulid(), 'label' => 'View Voucher', 'name' => 'view-voucher'],
            ['id' => Str::ulid(), 'label' => 'Delete Voucher', 'name' => 'delete-voucher'],
            ['id' => Str::ulid(), 'label' => 'Bulk Delete Voucher', 'name' => 'bulk-delete-voucher'],

            ['id' => Str::ulid(), 'label' => 'Create Customer', 'name' => 'create-customer'],
            ['id' => Str::ulid(), 'label' => 'Update Customer', 'name' => 'update-customer'],
            ['id' => Str::ulid(), 'label' => 'View Customer', 'name' => 'view-customer'],
            ['id' => Str::ulid(), 'label' => 'Delete Customer', 'name' => 'delete-customer'],

            ['id' => Str::ulid(), 'label' => 'Update Customer Level', 'name' => 'update-customer-level'],
            ['id' => Str::ulid(), 'label' => 'View Customer Level', 'name' => 'view-customer-level'],

            ['id' => Str::ulid(), 'label' => 'View Customer Verification', 'name' => 'view-customer-verification'],

            ['id' => Str::ulid(), 'label' => 'View Setting', 'name' => 'view-setting'],

            ['id' => Str::ulid(), 'label' => 'View Deposit', 'name' => 'view-deposit'],
            ['id' => Str::ulid(), 'label' => 'Update Deposit', 'name' => 'update-deposit'],

            ['id' => Str::ulid(), 'label' => 'View Sale', 'name' => 'view-sale'],

            ['id' => Str::ulid(), 'label' => 'Create Poin Reward', 'name' => 'create-poin-reward'],
            ['id' => Str::ulid(), 'label' => 'Update Poin Reward', 'name' => 'update-poin-reward'],
            ['id' => Str::ulid(), 'label' => 'View Poin Reward', 'name' => 'view-poin-reward'],
            ['id' => Str::ulid(), 'label' => 'Delete Poin Reward', 'name' => 'delete-poin-reward'],

            ['id' => Str::ulid(), 'label' => 'Create Bank Account', 'name' => 'create-account'],
            ['id' => Str::ulid(), 'label' => 'Update Bank Account', 'name' => 'update-account'],
            ['id' => Str::ulid(), 'label' => 'View Bank Account', 'name' => 'view-account'],
            ['id' => Str::ulid(), 'label' => 'Delete Bank Account', 'name' => 'delete-account'],

            ['id' => Str::ulid(), 'label' => 'Create Lokasi', 'name' => 'create-location'],
            ['id' => Str::ulid(), 'label' => 'Update Lokasi', 'name' => 'update-location'],
            ['id' => Str::ulid(), 'label' => 'View Lokasi', 'name' => 'view-location'],
            ['id' => Str::ulid(), 'label' => 'Delete Lokasi', 'name' => 'delete-location'],

            ['id' => Str::ulid(), 'label' => 'Create Profile Lokasi', 'name' => 'create-location-profile'],
            ['id' => Str::ulid(), 'label' => 'Update Profile Lokasi', 'name' => 'update-location-profile'],
            ['id' => Str::ulid(), 'label' => 'View Profile Lokasi', 'name' => 'view-location-profile'],
            ['id' => Str::ulid(), 'label' => 'Delete Profile Lokasi', 'name' => 'delete-location-profile'],

            ['id' => Str::ulid(), 'label' => 'Create Deposit Lokasi', 'name' => 'create-deposit-location'],
            ['id' => Str::ulid(), 'label' => 'Update Deposit Lokasi', 'name' => 'update-deposit-location'],
            ['id' => Str::ulid(), 'label' => 'View Deposit Lokasi', 'name' => 'view-deposit-location'],
            ['id' => Str::ulid(), 'label' => 'Delete Deposit Lokasi', 'name' => 'delete-deposit-location'],
        ];

        foreach ($permissions as $permission) {
            Permission::insert($permission);
        }

        $role = Role::create(['name' => 'admin']);

        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            $role->rolePermissions()->create(['permission_id' => $permission->id]);
        }

        User::create([
            'name' => 'Super Administrator',
            'email' => 'root@admin.com',
            'password' => bcrypt('password'),
            'photo' => 'sample/logo-jago.png',
            'username' => 'root',
            'phone_wa' => '81325307692',
        ]);

        User::create([
            'name' => 'Administator',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id,
            'photo' => 'sample/logo-jago.png',
            'username' => 'admin',
            'phone_wa' => '81325307692',
        ]);

        $setting = [];

        Setting::insert($setting);
    }
}
