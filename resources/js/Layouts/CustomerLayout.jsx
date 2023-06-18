import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import { router, usePage } from '@inertiajs/react'
import { HiOutlineHome } from 'react-icons/hi'
import {
    HiArrowPathRoundedSquare,
    HiBars3,
    HiOutlineGift,
    HiOutlineShoppingCart,
} from 'react-icons/hi2'

export default function CustomerLayout({ children }) {
    const {
        props: {
            auth: { user },
            cart_count,
            flash,
        },
    } = usePage()

    const handleOnClick = (r) => {
        router.get(route(r, { direct: 1 }))
    }

    const isActive = (r) => {
        if (route().current(r)) {
            return 'text-blue-700 font-bold'
        }

        return 'text-gray-600 font-light'
    }

    useEffect(() => {
        if (flash.message !== null) {
            toast(flash.message.message, { type: flash.message.type })
        }
    }, [flash])

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center">
            <div className="flex flex-col w-full bg-white shadow pb-20 min-h-[calc(90dvh)] max-w-md">
                <div>{children}</div>
            </div>
            <div className="fixed px-2 bottom-0 flex flex-row gap-0 justify-between w-full bg-gray-50 max-w-md">
                <div
                    className={`pb-1 pt-2 hover:bg-blue-200 flex flex-col items-center w-full ${isActive(
                        'home.*'
                    )}`}
                    onClick={() => handleOnClick('home.index')}
                >
                    <HiOutlineHome className="h-6 w-6" />
                    <div className="text-xs">Beranda</div>
                </div>
                <div
                    className={`pb-1 pt-2 hover:bg-blue-200 flex flex-col items-center w-full ${isActive(
                        'cart.index'
                    )}`}
                    onClick={() => handleOnClick('cart.index')}
                >
                    <div className="flex flex-row">
                        <HiOutlineShoppingCart className="h-6 w-6" />
                        <div>
                            <div className="bg-blue-300 text-blue-600 rounded-lg px-1 text-xs -ml-2">
                                {cart_count}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs">Keranjang</div>
                </div>
                <div
                    className={`pb-1 pt-2 hover:bg-blue-200 flex flex-col items-center w-full ${isActive(
                        'customer.poin.exchange'
                    )}`}
                    onClick={() => handleOnClick('customer.poin.exchange')}
                >
                    <div className="flex flex-row">
                        <HiOutlineGift className="h-6 w-6" />
                    </div>
                    <div className="text-xs">Poin</div>
                </div>
                <div
                    className={`pb-1 pt-2 hover:bg-blue-200 flex flex-col items-center w-full ${isActive(
                        'transactions.*'
                    )}`}
                    onClick={() => handleOnClick('transactions.index')}
                >
                    <HiArrowPathRoundedSquare className="h-6 w-6" />
                    <div className="text-xs">Transaksi</div>
                </div>
                <div
                    className={`py-2 hover:bg-blue-200 flex flex-col items-center w-full ${isActive(
                        'customer.profile.*'
                    )}`}
                    onClick={() =>
                        handleOnClick(
                            user !== null
                                ? 'customer.profile.index'
                                : 'customer.login'
                        )
                    }
                >
                    <HiBars3 className="h-6 w-6" />
                    <div className="text-xs">Menu</div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
