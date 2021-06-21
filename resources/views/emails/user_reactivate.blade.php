@component('mail::message')
# Account Reactivated

Hi {{ $user['firstname']}},

Your account had been reactivate on Tritek Dev Arena Platform. For more info, please contact Tritek Consulting.

@component('mail::button', ['url' => 'https://tritekdevarena.herokuapp.com/login', 'color' => 'success'])
Visit Website
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent