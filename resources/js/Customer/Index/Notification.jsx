import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiChevronLeft } from 'react-icons/hi2'

export default function Index({
    auth: { user },
    notification: { data, next_page_url },
}) {
    const [_notification, setpoins] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['notification'],
                onSuccess: (res) => {
                    setpoins(_notification.concat(res.props.notification.data))
                },
            }
        )
    }

    return (
        <CustomerLayout>
            <Head title="poin" />
            <div className="flex flex-col w-full min-h-[calc(90dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('home.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <div className="text-2xl px-5 font-bold">Notifikasi</div>
                <div className="w-full">
                    <div className="flex flex-col py-10 space-y-5 px-5">
                        {_notification.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {notification.format_created_at}
                                    </div>
                                    <div className="font-thin">
                                        {notification.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {next_page_url !== null && (
                            <div
                                onClick={handleNextPage}
                                className="w-full text-center px-2 py-1 border mt-5 hover:bg-blue-600 hover:text-white"
                            >
                                Load more
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
