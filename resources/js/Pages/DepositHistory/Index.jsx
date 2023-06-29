import React, { useEffect, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { HiEye } from 'react-icons/hi2'

import { formatIDR, hasPermission } from '@/utils'
import { DEPOSIT_STATUSES } from '@/constant'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'
import ThSort from '@/Components/ThSortComponent'

export default function Index(props) {
    const {
        deposits: { links, data },
        customers: { links: customer_links, data: customer_data },
        auth,
        stats,
        _search,
        _sortBy,
        _sortRule,
    } = props

    const [search, setSearch] = useState({
        q: _search,
        sortBy: _sortBy,
        sortRule: _sortRule,
    })
    const [status, setStatus] = useState('')
    const preValue = usePrevious(`${search}${status}`)

    const handleChangeSearch = (e) => {
        setSearch({
            ...search,
            q: e.target.value,
        })
    }

    const sort = (key, sort = null) => {
        if (sort !== null) {
            setSearch({
                ...search,
                sortBy: key,
                sortRule: sort,
            })
            return
        }
        setSearch({
            ...search,
            sortBy: key,
            sortRule: search.sortRule == 'asc' ? 'desc' : 'asc',
        })
    }

    const params = { ...search, status: status }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { ...search, status: status },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search, status])

    const canUpdate = hasPermission(auth, 'update-deposit')

    return (
        <AuthenticatedLayout page={'Deposit'} action={''}>
            <Head title="Deposit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Todal Deposit Bulan Ini{' '}
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.deposit_this_month)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Deposit Hari ini{' '}
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.deposit_today)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Todal Hutang Bulan Ini{' '}
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.paylater_this_month)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Hutang Hari ini{' '}
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.paylater_today)}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4 mb-2">
                        <div className="w-full overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Nama
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
                                                Saldo Hutang
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer_data.map((customer) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={customer.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline"
                                                >
                                                    <Link
                                                        href={route(
                                                            'customer.edit',
                                                            customer
                                                        )}
                                                    >
                                                        {customer.name}
                                                    </Link>
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.display_deposit}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {formatIDR(
                                                        customer.paylater_usage
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={customer_links} />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                            <div className="flex flex-row space-x-2">
                                <SearchInput
                                    onChange={handleChangeSearch}
                                    value={search.q}
                                />
                            </div>
                            <div className="flex flex-row space-x-2">
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    {DEPOSIT_STATUSES.map((status) => (
                                        <option
                                            value={status.value}
                                            key={status.value}
                                        >
                                            {status.key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <ThSort
                                                sort={sort}
                                                label={'description'}
                                                search={search}
                                            >
                                                #
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'customer_id'}
                                                search={search}
                                            >
                                                Customer
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'debit'}
                                                search={search}
                                            >
                                                Deposit
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'updated_at'}
                                                search={search}
                                            >
                                                Tanggal
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'is_valid'}
                                                search={search}
                                            >
                                                Status
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'updated_by'}
                                                search={search}
                                            >
                                                Approver
                                            </ThSort>
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
                                                    {deposit.description}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        className="hover:underline"
                                                        href={route(
                                                            'customer.edit',
                                                            deposit.customer.id
                                                        )}
                                                    >
                                                        {deposit.customer.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.amount}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.format_created_at}
                                                </td>
                                                <td
                                                    className={`py-4 px-6 ${deposit.status.text_color}`}
                                                >
                                                    {deposit.status.text}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {deposit.editor?.name}
                                                </td>
                                                <td className="py-4 px-6 flex justify-center">
                                                    {canUpdate && (
                                                        <Link
                                                            href={route(
                                                                'deposit.edit',
                                                                deposit
                                                            )}
                                                            className="flex space-x-1 items-center hover:underline"
                                                        >
                                                            <HiEye />
                                                            <div>Lihat</div>
                                                        </Link>
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
        </AuthenticatedLayout>
    )
}
