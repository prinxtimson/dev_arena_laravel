<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Project;

class AssignDev extends Notification
{
    use Queueable;

    public $user;
    public $project;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, Project $project)
    {
        //
        $this->user = $user;
        $this->project = $project;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('A new project had been assign to you, please login to your account to accept or decline.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

        /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            //
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'project_id' => $this->project->id,
            'project' => $this->project->name,
        ];
    }

        /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            //
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'project_id' => $this->project->id,
            'project' => $this->project->name,
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'project_id' => $this->project->id,
            'project' => $this->project->name,
        ];
    }
}
