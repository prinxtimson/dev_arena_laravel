<?php

namespace App\Events\Illuminate\Auth\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewUserAdded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $new_user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($new_user)
    {
        //
        $this->new_user = $new_user;
    }

}
