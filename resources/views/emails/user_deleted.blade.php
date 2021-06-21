@component('mail::message')
# Account Deleted

Hi {{ $user['firstname']}},

Your account had been deleted from Tritek Dev Arena Platform. For more info, please contact Tritek Consulting.

Thanks,<br>
{{ config('app.name') }}
@endcomponent