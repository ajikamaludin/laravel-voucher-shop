import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { HiEye } from 'react-icons/hi2'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import FormModal from './FormModal'
import SearchInput from '@/Components/SearchInput'
import { hasPermission } from '@/utils'
import { useModalState } from '@/hooks'

export default function Index(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const formModal = useModalState()

    const toggleFormModal = (deposit = null) => {
        formModal.setData(deposit)
        formModal.toggle()
    }

    const params = { q: search }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    const canUpdate = hasPermission(auth, 'update-deposit')

    return (
        <AuthenticatedLayout page={'Deposit'} action={''}>
            <Head title="Deposit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <SearchInput
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            </div>
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
                                                Customer
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Deposit
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Tanggal
                                            </th>
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
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((deposit) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={deposit.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {deposit.customer.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.amount}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.format_created_at}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.description}
                                                </td>
                                                <td
                                                    className={`py-4 px-6 ${deposit.status.text_color}`}
                                                >
                                                    {deposit.status.text}
                                                </td>
                                                <td className="py-4 px-6 flex justify-center">
                                                    {canUpdate && (
                                                        <div
                                                            className="flex space-x-1 items-center hover:underline"
                                                            onClick={() =>
                                                                toggleFormModal(
                                                                    deposit
                                                                )
                                                            }
                                                        >
                                                            <HiEye />
                                                            <div>Lihat</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FormModal modalState={formModal} />
        </AuthenticatedLayout>
    )
}
