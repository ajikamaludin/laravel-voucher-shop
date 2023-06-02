import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
                'resources/js/admin.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    // build: {
    //     // chunkSizeWarningLimit: 1024 * 2048, //2MB
    //     rollupOptions: {
    //         output: {
    //             manualChunks: {
    //                 chunk1: ['tinymce', /tinymce/],
    //             },
    //         },
    //     },
    // },
})
