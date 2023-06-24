import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { formatIDR } from '@/utils'

export default function Index({
    auth: { user },
    histories: { data, next_page_url },
}) {
    const [paylaters, setPaylaters] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['histories'],
                onSuccess: (res) => {
                    setPaylaters(paylaters.concat(res.props.histories.data))
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
                <div className="flex flex-col justify-between pb-5 border-b px-5">
                    <div className="flex flex-row justify-between w-full">
                        <div>
                            <div className="font-semibold text-2xl text-gray-400">
                                Terpakai
                            </div>
                            <div className="flex flex-row items-end">
                                <div className="font-bold text-3xl">
                                    Rp {formatIDR(user.paylater.usage)}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    / {formatIDR(user.paylater.limit)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                className="px-3 py-2 border rounded-full bg-blue-700 text-white hover:bg-transparent hover:text-black"
                                onClick={() =>
                                    router.get(
                                        route('transactions.deposit.topup')
                                    )
                                }
                            >
                                Bayar Tagihan
                            </div>
                        </div>
                    </div>
                    <div
                        className="mx-auto px-4 mt-4 py-2 text-xs text-blue-800 rounded-lg bg-blue-50 flex flex-row space-x-2 w-full items-center"
                        role="alert"
                    >
                        <div>
                            Lunasi pinjaman kamu dengan melakukan topup deposit
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col py-10 space-y-5 px-5">
                        {paylaters.map((history) => (
                            <div
                                key={history.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route(
                                            'customer.paylater.show',
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
                                        {history.amount}
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
