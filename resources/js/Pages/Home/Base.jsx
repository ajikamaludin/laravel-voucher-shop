import React from 'react'
import { Head } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Index({ status }) {
    return (
        <CustomerLayout>
            <Head title="Login" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div>Login</div>
            </div>
        </CustomerLayout>
    )
}
