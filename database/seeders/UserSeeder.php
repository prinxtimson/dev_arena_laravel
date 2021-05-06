<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $user = User::create([
            'name' => 'John Doe',
            'username' => 'johndoe',
            'avatar' => 'https://avatar.com',
            'email' => 'john.doe@example.com',
            'password' => Hash::make('123456'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
    'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        $user->assignRole('admin');

        $user->profile()->create([
            'firstname' => 'John',
            'lastname' => 'Doe',
            'phone' => '44012652634',
            'dev_stack' => '',
            'github' => '',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
    'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

    }
}
