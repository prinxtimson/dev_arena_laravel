<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DevAssignEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $address = 'noreply@dev-arena.com';
        $subject = 'Project Assignment';
        $name = 'Admin';

        return $this->view('view.name')
                    ->from($address, $name)
                    ->subject($subject)
                    ->with([ 'message' => $this->data['message']]);
    }
}
