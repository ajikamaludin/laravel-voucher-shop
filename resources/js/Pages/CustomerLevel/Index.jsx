import React from 'react'
import { Head } from '@inertiajs/react'
import { Dropdown } from 'flowbite-react'
import { HiPencil } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import FormModal from './FormModal'
import { formatIDR, hasPermission } from '@/utils'

export default function Info(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const formModal = useModalState()

    const toggleFormModal = (customerlevel = null) => {
        formModal.setData(customerlevel)
        formModal.toggle()
    }

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
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Minimal Deposit
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Maximal Deposit
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
                                                    {level.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {level.description}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(
                                                        level.min_amount
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(
                                                        level.max_amount
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 flex justify-center">
                                                    {canUpdate && (
                                                        <div
                                                            className="flex space-x-1 items-center hover:underline"
                                                            onClick={() =>
                                                                toggleFormModal(
                                                                    level
                                                                )
                                                            }
                                                        >
                                                            <HiPencil />
                                                            <div>Ubah</div>
                                                        </div>
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
            <FormModal modalState={formModal} />
        </AuthenticatedLayout>
    )
}
