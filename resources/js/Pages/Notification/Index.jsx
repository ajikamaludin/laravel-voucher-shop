import React from 'react'
import { Head, router } from '@inertiajs/react'
import { useModalState } from '@/hooks'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import { HiPencilSquare } from 'react-icons/hi2'
import { HiPencilAlt } from 'react-icons/hi'

export default function Index(props) {
    const {
        query: { links, data },
    } = props

    const formModal = useModalState()
    const handleNotification = (notif) => {
        fetch(route('api.notification.update', notif))
        router.get(route(route().current()))
    }
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Notifikasi'}
            action={''}
        >
            <Head title="Notifikasi" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {/* {canCreate && (
                                <Button
                                    size="sm"
                                    onClick={() => toggleFormModal()}
                                >
                                    Tambah
                                </Button>
                            )} */}
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Deskripsi
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Dibaca
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((notification) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={notification.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {notification.description}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {+notification.is_read === 1
                                                        ? 'Sudah dibaca'
                                                        : 'Belum dibaca'}
                                                </td>
                                                <td className="py-4 px-6 flex justify-end items-center space-x-2">
                                                    <HiPencilAlt />
                                                    <div
                                                        className="text-gray-600 hover:underline"
                                                        onClick={() =>
                                                            handleNotification(
                                                                notification
                                                            )
                                                        }
                                                    >
                                                        Tandai dibaca
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
