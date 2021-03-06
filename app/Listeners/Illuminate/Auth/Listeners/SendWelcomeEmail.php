<?php

namespace App\Listeners\Illuminate\Auth\Listeners;

use Illuminate\Auth\Events\NewUserAdded;
use App\Mail\NewUser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail
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
        Mail::to($event->user->email)->send(new NewUser($event->user));
    }
}
