import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormFile from '@/Components/FormFile'
import { formatIDR } from '@/utils'

export default function Detail(props) {
    const { sale } = props

    return (
        <AuthenticatedLayout page={`Sale`} action={`Invoice #${sale.code}`}>
            <Head title={`Invoice #${sale.code}`} />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <table className="relative w-full overflow-x-auto p-2 rounded">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Customer</td>
                                    <td>:</td>
                                    <td>{sale.customer.name}</td>
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
                                        Username
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Password
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Profile
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Comment
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Kuota
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item, index) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        key={item.voucher.id}
                                    >
                                        <td
                                            scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {index + 1}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.location.name}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.username}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.password}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.profile}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.comment}
                                        </td>
                                        <td scope="row" className="py-4 px-6">
                                            {item.voucher.display_quota}
                                        </td>
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
