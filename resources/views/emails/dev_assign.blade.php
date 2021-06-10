@component('mail::message')
# New Project Assigned

Hi {{ $data['user']['name']}},

Project {{$data['project']['name']}} had been assign to you, Please login to your account to acept or declined.

@component('mail::button', ['url' => 'https://tritekdevarena.herokuapp.com/login', 'color' => 'success'])
Visit Website
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
