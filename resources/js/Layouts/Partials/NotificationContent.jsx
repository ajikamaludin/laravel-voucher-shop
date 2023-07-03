import React from 'react'
import { router, usePage } from '@inertiajs/react'
import { HiOutlineBell } from 'react-icons/hi2'

import Dropdown from '@/Components/Defaults/Dropdown'
import { isEmpty } from 'lodash'

export default function NotificationContent() {
    const {
        props: { notifications, count_unread_notifications },
    } = usePage()
    const handleNotification = (notif) => {
        fetch(route('api.notification.update', notif))
        if (isEmpty(notif.url) === false) {
            router.visit(notif.url)
            return
        }
        router.get(route(route().current()))
    }

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div className="flex flex-row">
                    <HiOutlineBell className="h-6 w-6" />
                    <div>
                        <div className="bg-blue-300 text-blue-600 rounded-lg px-1 text-xs -ml-2">
                            {count_unread_notifications}
                        </div>
                    </div>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content width="64">
                {notifications.map((notif) => (
                    <div
                        className={`px-4 py-2 hover:bg-gray-100 border-b`}
                        onClick={() => handleNotification(notif)}
                        key={notif.id}
                    >
                        <div
                            className={`${+notif.is_read === 0 && 'font-bold'}`}
                        >
                            {notif.description}
                        </div>
                        <div className="text-xs">{notif.format_created_at}</div>
                    </div>
                ))}
                {notifications.length > 0 && (
                    <div className="w-full flex flex-row justify-between px-3">
                        <div
                            className="text-xs hover:text-blue-500 hover:underline"
                            onClick={() =>
                                router.get(route('notifications.index'))
                            }
                        >
                            lihat semua
                        </div>
                        <div
                            className="text-xs hover:text-blue-500 hover:underline"
                            onClick={() => handleNotification()}
                        >
                            tandai semua dibaca
                        </div>
                    </div>
                )}
                {notifications.length === 0 && (
                    <div className="px-4 py-2 ">Tidak ada notifikasi</div>
                )}
            </Dropdown.Content>
        </Dropdown>
    )
}
