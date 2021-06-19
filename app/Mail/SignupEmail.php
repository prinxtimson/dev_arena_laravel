<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SignupEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
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
        $subject = 'Dev Arena Onboarding';
        $name = 'Admin';

        return $this->markdown('view.emails.signup')
                    ->from($address, $name)
                    ->subject($subject)
                    ->with([ 'message' => $this->data['message']]);
    }
}
