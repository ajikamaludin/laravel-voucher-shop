import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HiChevronLeft } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Detail({ coin }) {
    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('customer.coin.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>

                {/* detail */}
                <div className="flex flex-row justify-between items-center pb-5 border-b px-5">
                    <div>
                        <div className="font-semibold text-xl text-gray-400">
                            {coin.description}
                        </div>
                        <div className="font-bold text-3xl">{coin.amount}</div>
                        <div className="text-gray-400">
                            {coin.format_created_at}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
