import React from 'react'
import { Head, Link } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { formatIDR } from '@/utils'

const SaleItem = ({ item, index }) => {
    const { voucher } = JSON.parse(item.additional_info_json)

    return (
        <>
            <td
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                {index + 1}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.location_profile.location.name}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.location_profile.name}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.username}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.comment}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.location_profile.quota}
            </td>
            <td scope="row" className="py-4 px-6">
                {voucher.location_profile.display_expired}
            </td>
        </>
    )
}

export default function Detail(props) {
    const { sale } = props

    return (
        <AuthenticatedLayout page={`Sale`} action={`${sale.code}`}>
            <Head title={`${sale.code}`} />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <table className="relative w-full overflow-x-auto p-2 rounded">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Customer</td>
                                    <td>:</td>
                                    <td>
                                        <Link
                                            href={route(
                                                'customer.edit',
                                                sale.customer
                                            )}
                                            className="hover:underline"
                                        >
                                            {sale.customer.name}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">
                                        Metode Pembayaran
                                    </td>
                                    <td>:</td>
                                    <td>{sale.payed_with}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Total</td>
                                    <td>:</td>
                                    <td>{formatIDR(sale.amount)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="px-1 font-bold my-2">Voucher</div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        No
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Lokasi
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Profile
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Kode
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Comment
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Kuota
                                    </th>

                                    <th scope="col" className="py-3 px-6">
                                        Masa Aktif
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item, index) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        key={item.id}
                                    >
                                        <SaleItem item={item} index={index} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
