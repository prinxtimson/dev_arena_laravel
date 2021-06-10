@component('mail::message')
# Welcome To Dev Arena

Hi {{ $user['firstname']}},

Welcome to Tritek Consulting Ltd Dev Arena Portal. Find the following is your login details to the Dev Arena Portal, Please be sure to change your password on your first login to the platform.

@component('mail::panel')
# Email: {{ $user['email'] }}
# Password: {{ $user['password'] }}
@endcomponent

@component('mail::button', ['url' => 'https://tritekdevarena.herokuapp.com/login', 'color' => 'success'])
Visit Website
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
