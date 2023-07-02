import React from 'react'
import { Head, Link } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Detail(props) {
    const { paylater } = props

    return (
        <AuthenticatedLayout
            page={'Pembayaran Hutang'}
            action={paylater.description}
            parent={route('paylater.index')}
        >
            <Head title="Pembayaran Hutang" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            {paylater.description}
                        </div>
                        <table className="relative w-full overflow-x-auto p-2 rounded">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Customer</td>
                                    <td>:</td>
                                    <td>
                                        <Link
                                            href={route('customer.edit', {
                                                customer: paylater.customer,
                                            })}
                                            className="hover:underline"
                                        >
                                            {paylater.customer.name}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Jumlah</td>
                                    <td>:</td>
                                    <td>{paylater.amount}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Status</td>
                                    <td>:</td>
                                    <td
                                        className={
                                            paylater.status_text.text_color
                                        }
                                    >
                                        {paylater.status_text.text}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Tanggal</td>
                                    <td>:</td>
                                    <td>{paylater.format_created_at}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
