import React from 'react'
import { Head } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Profile from './FormPartials/Profile'
import Paylater from './FormPartials/Paylater'
import Partner from './FormPartials/Partner'

export default function Form(props) {
    const { customer } = props
    return (
        <AuthenticatedLayout page={'Customer'} action={'Form'}>
            <Head title="Customer" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Customer</div>
                        <Profile />
                        {customer !== null && (
                            <>
                                <Paylater />
                                <Partner />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
