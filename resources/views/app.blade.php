<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="description" content="web shop online aplikasi jual voucher wifi online">

        <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
        <link rel="icon" type="image/png" href="/icon-512.png" sizes="512x512" />
        <link rel="mask-icon" href="/icon-512-maskable.png" color="#FFFFFF">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#000">

        <title inertia>{{ config('app.name', 'Voucher') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Customer/{$page['component']}.jsx"])
        @inertiaHead

        <script>
            if (typeof navigator.serviceWorker !== 'undefined') {
                navigator.serviceWorker.register('sw.js')
            }
        </script>
    </head>
    <body class="font-sans antialiased" creator="aji.kamaludin2021@gmail.com">
        @inertia
    </body>
</html>
