<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>Dev Arena</title>

        <link rel="icon" href="https://tritekconsulting.co.uk/wp-content/uploads/2021/01/logo-e1607448801387-1.png">
        <link rel="stylesheet" href="{{asset('css/app.css')}}">

    </head>
    <body class="antialiased" style="min-height: 100vh; background-color: whitesmoke;">
       <div id="app"></div>
       <script src="{{asset('js/app.js')}}"></script>
    </body>
</html>
