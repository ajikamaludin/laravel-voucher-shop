import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

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

    const [bounce, setBouce] = useState(false)

    const handleOnClick = (r) => {
        router.get(route(r, { direct: 1 }))
    }

    const isActive = (r) => {
        if (route().current(r)) {
            return 'text-primary-900 font-bold'
        }

        return 'text-gray-600 font-light'
    }

    const clearAnimate = () => {
        setBouce(false)
    }

    useEffect(() => {
        let se
        if (flash.message !== null && flash.message.type !== null) {
            toast.success((t) => {
                return (
                    <div onClick={() => toast.dismiss(t.id)}>
                        {flash.message.message}
                    </div>
                )
            })
            if (+flash.message.cart === 1) {
                setBouce(true)
                se = setTimeout(clearAnimate, 3000)
            }
        }
        return () => clearTimeout(se)
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
                    <div
                        className={`flex flex-row ${
                            bounce && 'motion-safe:animate-bounce'
                        }`}
                    >
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
                    onClick={() => handleOnClick('transactions.deposit.index')}
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
            <Toaster
                position="bottom-center"
                containerStyle={{ bottom: 70 }}
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                    },
                }}
            />
        </div>
    )
}
