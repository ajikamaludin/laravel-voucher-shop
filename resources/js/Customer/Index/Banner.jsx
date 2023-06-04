import React from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiChevronLeft } from 'react-icons/hi2'

export default function Banner({ banner }) {
    return (
        <CustomerLayout>
            <Head title="Login" />
            <div className="flex flex-col min-h-[calc(95dvh)] p-4">
                <div
                    className="w-full pb-4"
                    onClick={() => {
                        router.get(route('home.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <img
                    src={banner.image_url}
                    className="object-fill w-full h-32"
                />
                <div className="mt-4 mb-2 text-2xl font-bold">
                    {banner.title}
                </div>
                <div dangerouslySetInnerHTML={{ __html: banner.description }} />
            </div>
        </CustomerLayout>
    )
}
