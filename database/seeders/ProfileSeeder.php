<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $userId = User::first()->id;

        $profileId = DB::table('profiles')->insertGetId([
            'firstname' => 'John',
            'lastname' => 'Doe',
            'phone' => '44012652634',
            'dev_stack' => '',
            'github' => '',
            'user_id' => $userId,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
    'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('users')
            ->where('id', $userId)
            ->update([
            'profile_id' => $profileId
            ]);
    }
}
