import React from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import VoucherCard from './VoucherCard'
import { HiChevronLeft } from 'react-icons/hi2'

export default function Detail({ sale }) {
    return (
        <CustomerLayout>
            <Head title="Detail" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('transactions.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <div className="text-2xl px-5 font-bold">
                    Transaksi #{sale.code}
                </div>
                <div className="px-5">{sale.format_created_at}</div>
                <div className="px-5 pb-4 w-full">
                    <div className="text-xl font-bold text-right flex flex-row justify-between">
                        <div className="flex flex-col items-start">
                            <div>TOTAL</div>
                            <div className="text-xs font-thin text-gray-400">
                                pembayaran: {sale.payed_with}
                            </div>
                        </div>
                        <div> {sale.display_amount}</div>
                    </div>
                </div>

                <div className="w-full px-5 flex flex-col space-y-2">
                    {sale.items.map((item) => (
                        <VoucherCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </CustomerLayout>
    )
}
