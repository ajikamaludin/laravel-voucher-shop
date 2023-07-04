<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="description" content="web shop online aplikasi jual voucher wifi online">

        <title inertia>{{ config('app.name', 'Voucher') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

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
