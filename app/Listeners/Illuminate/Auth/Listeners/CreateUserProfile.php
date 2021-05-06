<?php

namespace App\Listeners\Illuminate\Auth\Listeners;

use Illuminate\Auth\Events\NewUserAdded;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use App\Models\Profile;

class CreateUserProfile
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NewUserAdded  $event
     * @return void
     */
    public function handle(NewUserAdded $event)
    {
        //
        $fields = $event->user;

        $profile = Profile::create('profiles')->insertGetId([
            'firstname' => $fields['firstname'],
            'lastname' => $fields['lastname'],
            'user_id' => $fields['id'],
        ]);

        $user = User::find($id);

        $user->update([
            'profile_id' =>  $profile->id,
        ]);
    }
}
