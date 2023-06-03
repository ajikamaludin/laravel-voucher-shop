import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Index({ query: { data, next_page_url } }) {
    const [sales, setSales] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['query'],
                onSuccess: (res) => {
                    setSales(sales.concat(res.props.query.data))
                },
            }
        )
    }

    return (
        <CustomerLayout>
            <Head title="Transaksi" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="py-5 text-2xl px-5 font-bold">
                    Transaksi Pembelian
                </div>
                <div className="w-full">
                    <div className="flex flex-col space-y-5 px-5">
                        {sales.map((sale) => (
                            <div
                                key={sale.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route('transactions.show', sale.id)
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div>{sale.format_human_created_at}</div>
                                    <div className="font-thin">
                                        Invoice{' '}
                                        <span className="font-bold">
                                            #{sale.code}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {sale.display_amount}
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
