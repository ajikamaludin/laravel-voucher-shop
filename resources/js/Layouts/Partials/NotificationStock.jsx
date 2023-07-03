import React, { useState, useEffect, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import { isEmpty } from 'lodash'
import { HiOutlineTicket } from 'react-icons/hi2'

import audioSrc from '@/../assets/warning.mp3'

import Dropdown from '@/Components/Defaults/Dropdown'
import { browserNotification } from './helpers'

export default function NotificationStock() {
    const {
        props: { stock_notifications },
    } = usePage()
    const [bounce, setBounce] = useState(false)
    const [notif, setNotif] = useState(stock_notifications)
    const audioRef = useRef()

    const handleNotification = (notif) => {
        if (isEmpty(notif) === false) {
            fetch(route('api.notification.update', notif))
            router.get(notif.url)
            return
        }
        fetch(route('api.notification.update'))
        router.get(route('dashboard'))
    }

    const handleAudioStop = () => {
        if (isEmpty(audioRef.current) === false) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setBounce(false)
    }

    const handleAudioPlay = () => {
        if (audioRef.current.currentTime !== 0) {
            handleAudioStop()
        }

        try {
            audioRef.current.play()
        } catch (error) {
            console.log(error)
        }

        setBounce(true)
        setTimeout(() => setBounce(false), 22000)
    }

    const handleUpdate = async (e) => {
        setNotif(e.message.stock_notifications)
        handleAudioPlay()
        browserNotification(
            'Notifikasi Stok Voucher',
            e.message.description,
            e.message.url
        )
    }

    useEffect(() => {
        window.Echo.channel('notification')
            .listen('NotificationEvent', (e) => {
                if (e.message.type === 'voucher_stock') {
                    handleUpdate(e)
                }
            })
            .error((error) => {
                console.error(error)
            })
        return () => {
            window.Echo.leave('notification')
        }
    }, [])

    return (
        <Dropdown>
            <audio id="audio" loop={false} autoPlay={false} ref={audioRef}>
                <source src={audioSrc} type="audio/mpeg" />
            </audio>
            <Dropdown.Trigger>
                <div
                    className={`flex flex-row ${
                        bounce && 'motion-safe:animate-bounce'
                    }`}
                    onClick={() => handleAudioStop()}
                >
                    <HiOutlineTicket className="h-6 w-6" />
                    <div>
                        <div className="bg-yellow-300 text-yelbg-yellow-600 rounded-lg px-1 text-xs -ml-2">
                            {notif.length}
                        </div>
                    </div>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content width="64">
                {notif.map((notif) => (
                    <div
                        className={`px-4 py-2 hover:bg-gray-100 border-b`}
                        onClick={() => handleNotification(notif)}
                        key={notif.format_created_at}
                    >
                        <div className="font-bold">{notif.description}</div>
                        <div className="text-xs">{notif.format_created_at}</div>
                    </div>
                ))}
                {notif.length > 0 && (
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
                {notif.length === 0 && (
                    <div className="px-4 py-2 ">Tidak ada notifikasi</div>
                )}
            </Dropdown.Content>
        </Dropdown>
    )
}
