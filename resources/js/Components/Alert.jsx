import { isEmpty } from 'lodash'
import React from 'react'

export default function Alert({ type = '', children }) {
    if (type === null) {
        return ''
    }

    if (type === 'error') {
        return (
            <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
            >
                {children}
            </div>
        )
    }

    if (type === 'success') {
        return (
            <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
            >
                {children}
            </div>
        )
    }

    return (
        <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
        >
            {children}
        </div>
    )
}
