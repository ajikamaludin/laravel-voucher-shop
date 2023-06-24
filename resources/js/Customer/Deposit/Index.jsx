import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2'
import HeaderTrx from '../Components/HeaderTrx'

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
                <HeaderTrx />
                <div className="w-full">
                    <div className="flex flex-col space-y-5 px-5">
                        {deposites.map((history) => (
                            <div
                                key={history.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route(
                                            'transactions.deposit.show',
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
                                    {+history.is_valid !== 0 && (
                                        <div
                                            className={`text-xs px-2 py-1 rounded-full border text-white ${history.status.color}`}
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
