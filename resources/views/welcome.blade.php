<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>Dev Arena</title>
        
        <link rel="stylesheet" href="{{secure_asset('css/app.css')}}">

    </head>
    <body class="antialiased">
       <div id="app"></div>
       <script src="{{secure_asset('js/app.js')}}"></script>
    </body>
</html>
