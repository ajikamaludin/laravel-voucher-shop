import React from 'react'
import { Head } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Index({ status }) {
    return (
        <CustomerLayout>
            <Head title="Home" />
            <h1>This is HOME</h1>
        </CustomerLayout>
    )
}
