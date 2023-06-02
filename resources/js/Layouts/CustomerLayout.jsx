import React from 'react'
import ApplicationLogo from '@/Components/Defaults/ApplicationLogo'
import { Link, router, usePage } from '@inertiajs/react'
import { HiHome, HiOutlineHome, HiOutlineUserCircle } from 'react-icons/hi'
import {
    HiArrowPathRoundedSquare,
    HiOutlineShoppingCart,
} from 'react-icons/hi2'

export default function CustomerLayout({ children }) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()
    const handleOnClick = (r) => {
        router.get(route(r))
    }

    const isActive = (r) => {
        if (route().current(r)) {
            return 'text-blue-700 h-8 w-8'
        }

        return 'text-gray-600 h-8 w-8'
    }

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center">
            <div className="flex flex-col w-full bg-white shadow pb-20 min-h-[calc(90dvh)] max-w-md">
                <div>{children}</div>
            </div>
            <div className="fixed bottom-0 flex flex-row justify-around w-full bg-gray-50 max-w-md">
                <div
                    className="py-2 px-5  hover:bg-blue-200"
                    onClick={() => handleOnClick('home.index')}
                >
                    <HiOutlineHome className={isActive('home.index')} />
                </div>
                <div className="py-2 px-5  hover:bg-blue-200 flex flex-row">
                    <HiOutlineShoppingCart className="text-gray-600 h-8 w-8" />
                    <div>
                        <div className="bg-blue-300 text-blue-600 rounded-lg px-1 text-xs -ml-2">
                            1
                        </div>
                    </div>
                </div>
                <div className="py-2 px-5  hover:bg-blue-200">
                    <HiArrowPathRoundedSquare className="text-gray-600 h-8 w-8" />
                </div>
                {user !== null ? (
                    <div
                        className="py-2 px-5  hover:bg-blue-200"
                        onClick={() => handleOnClick('customer.profile.index')}
                    >
                        <HiOutlineUserCircle
                            className={isActive('customer.profile.*')}
                        />
                    </div>
                ) : (
                    <div
                        className="py-2 px-5 hover:bg-blue-200"
                        onClick={() => handleOnClick('customer.login')}
                    >
                        <HiOutlineUserCircle
                            className={isActive('customer.login')}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
