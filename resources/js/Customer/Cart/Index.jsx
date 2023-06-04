import React from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import VoucherCard from './VoucherCard'
import { formatIDR } from '@/utils'

const EmptyHere = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">
                Wah, keranjang belanjamu kosong
            </div>
            <div className="text-gray-400">
                Yuk, pilih paket voucher terbaik mu!
            </div>
        </div>
    )
}

export default function Index({ auth: { user }, carts, total }) {
    const canPay = +user.deposit_balance >= +total

    const handleSubmit = () => {
        router.post(route('cart.purchase'))
    }

    const handleTopUp = () => {
        router.get(route('customer.deposit.topup'))
    }

    return (
        <CustomerLayout>
            <Head title="Index" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="py-5 text-2xl px-5 font-bold">Keranjang</div>

                {carts.length > 0 ? (
                    <>
                        <div className="w-full px-5 flex flex-col space-y-2">
                            {carts.map((item) => (
                                <VoucherCard key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="fixed bottom-20 right-0 w-full">
                            <div className="max-w-sm mx-auto text-right text-gray-400">
                                Saldo: {formatIDR(user.deposit_balance)}
                            </div>
                            <div className="max-w-sm mx-auto text-xl font-bold text-right flex flex-row justify-between">
                                <div>TOTAL</div>
                                <div> {formatIDR(total)}</div>
                            </div>
                            {canPay ? (
                                <div
                                    onClick={handleSubmit}
                                    className="mt-3 border bg-blue-700 text-white px-5 py-2 mx-auto rounded-full hover:text-black hover:bg-white max-w-sm"
                                >
                                    Bayar
                                </div>
                            ) : (
                                <div className="flex flex-row w-full mx-auto space-x-2 max-w-sm items-center mt-3">
                                    <div className="border border-gray-500 bg-gray-400 text-white px-5 py-2 rounded-full flex-1">
                                        Saldo tidak cukup
                                    </div>
                                    <div
                                        onClick={handleTopUp}
                                        className="border bg-blue-700 text-white px-5 py-2 rounded-full hover:text-black hover:bg-white"
                                    >
                                        Top Up
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <EmptyHere />
                )}
            </div>
        </CustomerLayout>
    )
}
