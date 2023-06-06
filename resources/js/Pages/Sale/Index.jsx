import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { HiEye } from 'react-icons/hi'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'
import { formatIDR } from '@/utils'
import { usePrevious } from 'react-use'

export default function Info(props) {
    const {
        query: { links, data },
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

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

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Sale'}
            action={''}
        >
            <Head title="Sale" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {/* {canCreate && (
                                <Link href={route('banner.create')}>
                                    <Button size="sm">Tambah</Button>
                                </Link>
                            )} */}
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
                                                Voucher
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6 w-1/8"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((sale) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={sale.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {sale.code}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sale.customer.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sale.format_created_at}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(
                                                        sale.items_count
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(sale.amount)}
                                                </td>
                                                <td
                                                    className="py-4 px-6 flex justify-center items-center space-x-1 hover:underline"
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                'sale.show',
                                                                sale
                                                            )
                                                        )
                                                    }
                                                >
                                                    <HiEye />
                                                    <div>Lihat</div>
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
        </AuthenticatedLayout>
    )
}
