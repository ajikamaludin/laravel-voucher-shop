import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { HiPencil } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import { formatIDR, hasPermission } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'

export default function Info(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const formModal = useModalState()

    const canUpdate = hasPermission(auth, 'update-customer-level')

    return (
        <AuthenticatedLayout page={'Customer Level'} action={''}>
            <Head title="Customer Level" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">{/*  */}</div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Logo
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((level) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={level.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    <img
                                                        src={level.logo_url}
                                                        className="h-20"
                                                        alt="logo alt"
                                                    />
                                                </td>
                                                <td className="py-4 px-6">
                                                    {level.name}
                                                </td>
                                                <td className="py-4 px-6 flex flex-row justify-end items-center">
                                                    {canUpdate && (
                                                        <Link
                                                            className="flex space-x-1 items-center hover:underline"
                                                            href={route(
                                                                'customer-level.edit',
                                                                level.id
                                                            )}
                                                        >
                                                            <HiPencil />
                                                            <div>Ubah</div>
                                                        </Link>
                                                    )}
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
