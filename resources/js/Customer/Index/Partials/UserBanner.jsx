import React from 'react'
import { router, usePage } from '@inertiajs/react'
import { HiOutlineBell } from 'react-icons/hi'

import BalanceBanner from './BalanceBanner'

export default function UserBanner({ user }) {
    const {
        props: { notification_count },
    } = usePage()
    return (
        <div>
            {/* user */}
            <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                <div className="flex flex-col text-white">
                    <div className="font-bold">{user.name}</div>
                    <div className="flex flex-row items-center space-x-1 -mt-1">
                        <div className="text-sm ">{user.username}</div>
                        <div className="text-xs font-semibold px-2 py-1 bg-white text-black rounded-xl">
                            {user.level.name}
                        </div>
                    </div>
                </div>
                <div
                    className="flex flex-row"
                    onClick={() => {
                        router.get(route('notification.index'))
                    }}
                >
                    <HiOutlineBell className="text-white w-7 h-7" />
                    <div>
                        <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                            {notification_count}
                        </div>
                    </div>
                </div>
            </div>
            {/* saldo */}
            <BalanceBanner user={user} />
        </div>
    )
}
