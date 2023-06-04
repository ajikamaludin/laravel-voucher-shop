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
                <div className="px-5 pb-4">{sale.format_created_at}</div>

                <div className="w-full px-5 flex flex-col space-y-2">
                    {sale.items.map((item) => (
                        <VoucherCard key={item.id} item={item} />
                    ))}
                </div>
                <div className="fixed bottom-20 right-0 w-full">
                    <div className="max-w-sm mx-auto text-xl font-bold text-right flex flex-row justify-between">
                        <div>TOTAL</div>
                        <div> {sale.display_amount}</div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
