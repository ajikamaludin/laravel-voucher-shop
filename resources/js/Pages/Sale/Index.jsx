import React, { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { HiEye, HiFilter, HiOutlineFilter } from 'react-icons/hi'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'
import { formatIDR } from '@/utils'
import { useModalState } from '@/hooks'
import ModalFilter from './ModalFilter'
import ThSort from '@/Components/ThSortComponent'

export default function Info(props) {
    const {
        query: { links, data },
        customer_with_deposit,
        customer_with_paylaters,
        _q,
        _sortBy,
        _sortRule,
    } = props

    const filterModal = useModalState()

    const [search, setSearch] = useState({
        q: _q,
        sortBy: _sortBy,
        sortRule: _sortRule,
    })
    const preValue = usePrevious(search)

    const handleChangeSearch = (e) => {
        setSearch({
            ...search,
            q: e.target.value,
        })
    }

    const handleFilter = (filter) => {
        setSearch({
            ...search,
            ...filter,
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

    const params = { ...search }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { ...search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <AuthenticatedLayout page={'Sale'} action={''}>
            <Head title="Sale" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="flex flex-col gap-2 items-start md:flex-row p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 mb-2">
                        <div className="w-full overflow-auto">
                            <div className="text-lg font-bold mb-2">
                                Saldo Deposit
                            </div>
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
                                                Total Beli
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer_with_deposit.map((sale) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={sale.customer_id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline"
                                                >
                                                    <Link
                                                        href={route(
                                                            'customer.edit',
                                                            sale
                                                        )}
                                                    >
                                                        {sale.customer.name}
                                                    </Link>
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    Rp. {formatIDR(sale.total)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-full overflow-auto">
                            <div className="text-lg font-bold mb-2">
                                Saldo Hutang
                            </div>
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
                                                Total Beli
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer_with_paylaters.map((sale) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={sale.customer_id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline"
                                                >
                                                    <Link
                                                        href={route(
                                                            'customer.edit',
                                                            sale
                                                        )}
                                                    >
                                                        {sale.customer.name}
                                                    </Link>
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    Rp. {formatIDR(sale.total)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <div>
                                <div
                                    className="px-3 py-2 rounded-md border bg-gray-600 border-gray-700 hover:bg-gray-500"
                                    onClick={() => filterModal.toggle()}
                                >
                                    <HiOutlineFilter className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <ThSort
                                                sort={sort}
                                                label={'code'}
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
                                                label={'created_at'}
                                                search={search}
                                            >
                                                Tanggal
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'payed_with'}
                                                search={search}
                                            >
                                                Pembayaran
                                            </ThSort>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Voucher
                                            </th>
                                            <ThSort
                                                sort={sort}
                                                label={'amount'}
                                                search={search}
                                            >
                                                Total
                                            </ThSort>
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
                                                <td className="py-4 px-6 hover:underline">
                                                    <Link
                                                        href={route(
                                                            'customer.edit',
                                                            sale.customer
                                                        )}
                                                    >
                                                        {sale.customer.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sale.format_created_at}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sale.payment_with}
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
            <ModalFilter state={filterModal} handleFilter={handleFilter} />
        </AuthenticatedLayout>
    )
}
