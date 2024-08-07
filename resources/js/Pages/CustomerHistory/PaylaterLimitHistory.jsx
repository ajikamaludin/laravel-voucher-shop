import React from 'react'
import { Link, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import Button from '@/Components/Button'
import { HiRefresh } from 'react-icons/hi'
import { formatIDR } from '@/utils'

export default function PaylaterLimitHistory(props) {
    const {
        query: { links, data },
        customer,
    } = props

    return (
        <AuthenticatedLayout
            page={'Mitra WBB'}
            action={[customer.name, 'Riwayat Topup Limit']}
            parent={route('mitra.edit', customer)}
        >
            <Head title="Riwayat Topup Limit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="w-full flex flex-row justify-between">
                            <div>
                                <Link href={route('paylater.update.limit')}>
                                    <Button color="primary" size="sm">
                                        Tambah
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <Button
                                    onClick={() =>
                                        router.visit(
                                            route(route().current(), customer)
                                        )
                                    }
                                >
                                    <HiRefresh className="w-5 h-5" />
                                </Button>
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
                                                #
                                            </th>
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
                                                Tanggal
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Limit
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Keterangan
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Creator
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((history) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={history.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {history.description}
                                                </td>
                                                <td>
                                                    <Link
                                                        className="hover:underline"
                                                        href={route(
                                                            'mitra.edit',
                                                            customer.id
                                                        )}
                                                    >
                                                        {customer.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {history.format_created_at}
                                                </td>
                                                <td className="py-4 px-6">
                                                    Rp.{' '}
                                                    {formatIDR(history.credit)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {history.note}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {history.creator.name}
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
