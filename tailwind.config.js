const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './resources/views/**/*.blade.php',
        './app/Models/*.php',
        './resources/js/**/*.jsx',
        './node_modules/flowbite/**/*.js',
        './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
        },
        colors: {
            primary: {
                50: '#edf7ff',
                100: '#d6ebff',
                200: '#b6deff',
                300: '#84cbff',
                400: '#4aaeff',
                500: '#2089ff',
                600: '#0867ff',
                700: '#024ff3',
                800: '#0940c4',
                900: '#0e3995',
                950: '#0e255d',
            },
            secondary: {
                50: '#fffceb',
                100: '#fdf4c8',
                200: '#fbe88c',
                300: '#f9d650',
                400: '#f7c328',
                500: '#f1a410',
                600: '#d57d0a',
                700: '#b1580c',
                800: '#904510',
                900: '#763911',
                950: '#441c04',
            },
        },
    },

    plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}
