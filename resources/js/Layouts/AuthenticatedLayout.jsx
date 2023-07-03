import React, { useState, useEffect, useRef } from 'react'
import { router, Link, usePage } from '@inertiajs/react'
import { Breadcrumb, Flowbite } from 'flowbite-react'
import { ToastContainer, toast } from 'react-toastify'
import { HiMenu, HiChevronDown, HiHome } from 'react-icons/hi'
import { HiOutlineBell } from 'react-icons/hi2'

import ApplicationLogo from '@/Components/Defaults/ApplicationLogo'
import Dropdown from '@/Components/Defaults/Dropdown'
import SidebarNav from './Partials/SidebarNav'
import NotificationContent from './Partials/NotificationContent'
import NotificationDeposit from './Partials/NotificationDeposit'
import NotificationStock from './Partials/NotificationStock'

const customTheme = {
    button: {
        color: {
            primary: 'bg-blue-700 hover:bg-blue-600 text-white',
        },
    },
    dropdown: {
        color: {
            primary: 'bg-blue-700 hover:bg-blue-600 text-white',
        },
    },
}

export default function Authenticated({
    children,
    page = '',
    action = '',
    parent = null,
}) {
    const {
        props: { count_unread_notifications, notifications, auth, flash },
    } = usePage()
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false)

    useEffect(() => {
        if (flash.message !== null) {
            toast(flash.message.message, { type: flash.message.type })
        }
    }, [flash])

    useEffect(() => {
        if (typeof Notification !== undefined) {
            Notification.requestPermission()
        }
    }, [])

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-700">
                <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href={route('dashboard')}>
                                        <ApplicationLogo className="block pt-2 h-12 w-full font-bold text-2xl fill-current dark:text-gray-200" />
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <div className="ml-3 relative">
                                    <NotificationStock />
                                </div>
                                <div className="ml-3 relative">
                                    <NotificationDeposit />
                                </div>
                                <div className="ml-3 relative">
                                    <NotificationContent />
                                </div>
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150 dark:bg-gray-700 dark:hover:text-gray-50 dark:text-gray-200 gap-2"
                                                >
                                                    <img
                                                        src={
                                                            auth.user.photo_url
                                                        }
                                                        alt="user profile image"
                                                        className="h-10 rounded-full border border-gray-100"
                                                        loading="lazy"
                                                    />
                                                    {auth.user.name}
                                                    <HiChevronDown />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <a
                                                href={route('home.index')}
                                                target="_blank"
                                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out dark:text-white hover:dark:bg-gray-500"
                                            >
                                                Visit Site
                                            </a>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-mr-2 flex items-center sm:hidden space-x-2">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <HiMenu />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex flex-row">
                    <div
                        className={`w-fit h-screen md:h-full absolute z-10 bg-gray-50 ${
                            !showingNavigationDropdown && 'collapse md:visible'
                        }`}
                    >
                        <SidebarNav user={auth.user} />
                    </div>
                    <main className="md:pl-64 w-full">
                        {page !== '' && (
                            <Breadcrumb
                                className="bg-gray-200 py-3 px-5 mb-2 dark:bg-gray-700"
                                onClick={() =>
                                    parent === null
                                        ? router.visit(route('dashboard'))
                                        : router.visit(parent)
                                }
                            >
                                <Breadcrumb.Item icon={HiHome}>
                                    <p className="mt-0.5">{page}</p>
                                </Breadcrumb.Item>
                                {typeof action === 'string' && (
                                    <Breadcrumb.Item>{action}</Breadcrumb.Item>
                                )}
                                {typeof action === 'object' &&
                                    action.map((item) => (
                                        <Breadcrumb.Item key={item}>
                                            {item}
                                        </Breadcrumb.Item>
                                    ))}
                            </Breadcrumb>
                        )}
                        <div className="py-4">{children}</div>
                    </main>
                </div>
                <ToastContainer />
            </div>
        </Flowbite>
    )
}
