import React from 'react'
import { Head } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Banner({ banner }) {
    return (
        <CustomerLayout>
            <Head title="Login" />
            <div className="flex flex-col min-h-[calc(95dvh)] p-4">
                <img
                    src={banner.image_url}
                    className="object-cover w-full h-32"
                />
                <div className="mt-4 mb-2 text-2xl font-bold">
                    {banner.title}
                </div>
                <div dangerouslySetInnerHTML={{ __html: banner.description }} />
            </div>
        </CustomerLayout>
    )
}
