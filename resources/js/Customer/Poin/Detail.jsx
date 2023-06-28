import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HiChevronLeft, HiClipboardDocumentList } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import { handleCopyToClipboard } from '@/Customer/utils'

export default function Detail({ poin }) {
    return (
        <CustomerLayout>
            <Head title="Poin" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('transactions.poin.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>

                {/* detail */}
                <div className="w-full flex flex-col justify-between pb-5 border-b px-5">
                    <div
                        className="font-semibold text-xl text-gray-400 flex flex-row items-center w-full"
                        onClick={() => handleCopyToClipboard(poin.description)}
                    >
                        <div>{poin.description}</div>
                        <div className="pl-3">
                            <HiClipboardDocumentList />
                        </div>
                    </div>
                    <div className="font-bold text-3xl">{poin.amount} poin</div>
                    <div className="text-gray-400">
                        {poin.format_created_at}
                    </div>
                </div>
                <div className="w-full px-5">
                    <div className="my-5">
                        <div className="bg-blue-50 text-blue-700 p-3 border rounded-md">
                            {poin.narration}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
