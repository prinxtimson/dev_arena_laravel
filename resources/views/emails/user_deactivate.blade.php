@component('mail::message')
# Account Deactivated

Hi {{ $user['firstname']}},

Your account had been deactivated from Tritek Dev Arena Platform. For more info, please contact Tritek Consulting.

Thanks,<br>
{{ config('app.name') }}
@endcomponent