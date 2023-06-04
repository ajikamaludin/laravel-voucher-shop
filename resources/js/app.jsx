import './bootstrap'
import '../css/app.css'
import '../css/spinner.css'
import 'flowbite'
import 'react-toastify/dist/ReactToastify.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName =
    window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel'

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Customer/${name}.jsx`,
            import.meta.glob('./Customer/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el)

        root.render(<App {...props} />)
    },
    progress: { color: '#003bf1', showSpinner: true, includeCSS: true },
})
