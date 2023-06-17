<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="description" content="web shop online aplikasi jual voucher wifi online">


        <title inertia>{{ config('app.name', 'Voucher') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Customer/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased" creator="aji.kamaludin2021@gmail.com">
        @inertia
    </body>
</html>
