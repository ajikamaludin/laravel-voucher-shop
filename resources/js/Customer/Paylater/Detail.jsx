import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HiChevronLeft } from 'react-icons/hi2'
import { isEmpty } from 'lodash'

import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Detail({ paylater }) {
    return (
        <CustomerLayout>
            <Head title="Mitra WBB" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('customer.paylater.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>

                {/* detail */}
                <div className="flex flex-row justify-between items-center pb-5 border-b px-5">
                    <div>
                        <div className="font-semibold text-xl text-gray-400">
                            {paylater.description}
                        </div>
                        <div className="font-bold text-3xl">
                            {paylater.amount}
                        </div>
                        <div className="text-gray-400">
                            {paylater.format_created_at}
                        </div>
                    </div>
                </div>
                <div className="w-full px-5">
                    <div className="my-5">
                        {isEmpty(paylater.note) === false && (
                            <div className="bg-blue-50 text-blue-700 p-3 border rounded-md">
                                {paylater.note}
                            </div>
                        )}
                        {isEmpty(paylater.status) === false && (
                            <div className="bg-red-50 text-red-700 p-3 border rounded-md">
                                {paylater.status}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
