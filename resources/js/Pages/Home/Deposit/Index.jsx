import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { formatIDR } from '@/utils'

export default function Index({
    auth: { user },
    histories: { data, next_page_url },
}) {
    const [deposites, setDeposites] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['histories'],
                onSuccess: (res) => {
                    setDeposites(deposites.concat(res.props.histories.data))
                },
            }
        )
    }

    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col w-full min-h-[calc(90dvh)]">
                <div className="w-full pt-10 px-5">
                    <div className="text-base">{user.fullname}</div>
                </div>
                <div className="flex flex-row justify-between items-center pb-10 border-b px-5">
                    <div>
                        <div className="font-semibold text-xl text-gray-400">
                            Saldo
                        </div>
                        <div className="font-bold text-3xl">
                            Rp {user.display_deposit}
                        </div>
                    </div>
                    <div>
                        <div
                            className="px-3 py-2 border rounded-full bg-blue-700 text-white hover:bg-transparent hover:text-black"
                            onClick={() =>
                                router.get(route('customer.deposit.topup'))
                            }
                        >
                            Top Up
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col py-10 space-y-5 px-5">
                        {deposites.map((history) => (
                            <div
                                key={history.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route(
                                            'customer.deposit.show',
                                            history.id
                                        )
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {history.format_human_created_at}
                                    </div>
                                    <div className="font-thin">
                                        {history.description}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {formatIDR(history.amount)}
                                    </div>
                                    {+history.is_valid !== 0 && (
                                        <div
                                            className={`text-xs px-2 py-1 rounded-full border ${history.status.color} text-white`}
                                        >
                                            {history.status.text}
                                        </div>
                                    )}
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
