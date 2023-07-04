import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { formatIDR } from '@/utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import VoucherCard from './VoucherCard'
import EmptyHere from './IndexPartials/EmptyHere'
import { useModalState } from '@/hooks'
import Payment from './IndexPartials/Payment'

export default function Index({ carts: items, total, allow_process }) {
    const [carts, setCarts] = useState(items)
    const paymentModal = useModalState()

    const removeCart = (cart) => {
        setCarts(carts.filter((c) => c.id !== cart.id))
    }

    console.log(carts)
    const changeQty = (cart, qty) => {
        setCarts(
            carts.map((c) => {
                if (c.id === cart.id) {
                    return {
                        ...c,
                        quantity: qty,
                    }
                }
                return c
            })
        )
    }

    const handlePayment = () => {
        paymentModal.toggle()
    }

    const handleTopUp = () => {
        router.get(route('transactions.deposit.topup'))
    }

    return (
        <CustomerLayout>
            <Head title="Cart" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="py-5 text-2xl px-5 font-bold">Keranjang</div>
                {carts.length > 0 ? (
                    <>
                        <div className="w-full px-2 flex flex-col space-y-2 pb-28">
                            {carts.map((item) => (
                                <VoucherCard
                                    key={item.id}
                                    item={item}
                                    onRemove={removeCart}
                                    onChangeQty={changeQty}
                                />
                            ))}
                        </div>
                        <div className="fixed bottom-12 w-full bg-white py-5 px-2 shadow-lg border-t max-w-md mx-auto">
                            <div className="flex flex-row justify-between px-5">
                                <div className="flex flex-col">
                                    <div className="text-gray-400">
                                        Total Harga
                                    </div>
                                    <div className="font-bold text-lg">
                                        Rp. {formatIDR(total)}
                                    </div>
                                </div>
                                {allow_process ? (
                                    <div
                                        onClick={handlePayment}
                                        className="font-bold h-11 border bg-blue-700 text-white px-5 py-2 rounded-full hover:text-black hover:bg-white"
                                    >
                                        Bayar
                                    </div>
                                ) : (
                                    <div
                                        onClick={handleTopUp}
                                        className="font-bold h-11 border bg-blue-700 text-white px-5 py-2 rounded-full hover:text-black hover:bg-white"
                                    >
                                        Top Up
                                    </div>
                                )}
                            </div>
                            {allow_process === false && (
                                <div className="-mt-2 px-5 text-right text-sm text-gray-500">
                                    saldo tidak cukup
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <EmptyHere />
                )}
            </div>
            <Payment state={paymentModal} />
        </CustomerLayout>
    )
}
