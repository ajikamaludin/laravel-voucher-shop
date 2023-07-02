import React from 'react'
import { Head, Link } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { isEmpty } from 'lodash'
import { formatIDDate, formatIDR } from '@/utils'

export default function Detail(props) {
    const { paylater, deposit } = props

    return (
        <AuthenticatedLayout
            page={'Pembayaran Hutang'}
            action={paylater.description}
            parent={route('paylater.repay.index')}
        >
            <Head title="Pembayaran Hutang" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="flex flex-row justify-between">
                            <div className="text-xl font-bold mb-4">
                                {paylater.description}
                            </div>
                        </div>
                        {isEmpty(deposit) === true && (
                            <table className="relative w-full overflow-x-auto p-2 rounded">
                                <tbody>
                                    <tr>
                                        <td className="font-bold">Customer</td>
                                        <td>:</td>
                                        <td>
                                            <Link
                                                href={route('mitra.edit', {
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
                                    <tr>
                                        <td className="font-bold">
                                            Pembayaran Hutang
                                        </td>
                                        <td>:</td>
                                        <td>
                                            {isEmpty(
                                                paylater.not_fullpayment_reason
                                            ) === false ? (
                                                <p>Sebagian</p>
                                            ) : (
                                                <p>Penuh</p>
                                            )}
                                        </td>
                                    </tr>
                                    {isEmpty(paylater.next_payment) ===
                                        false && (
                                        <tr>
                                            <td className="font-bold">
                                                Tanggal Pemenuhan
                                            </td>
                                            <td>:</td>
                                            <td>
                                                {formatIDDate(
                                                    paylater.next_payment
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                        {isEmpty(deposit) === false && (
                            <>
                                <table className="relative w-full overflow-x-auto p-2 rounded">
                                    <tbody>
                                        <tr>
                                            <td className="font-bold">
                                                Customer
                                            </td>
                                            <td>:</td>
                                            <td>
                                                <Link
                                                    href={route('mitra.edit', {
                                                        customer:
                                                            deposit.customer,
                                                    })}
                                                    className="hover:underline"
                                                >
                                                    {deposit.customer.name}
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">
                                                Metode Pembayaran
                                            </td>
                                            <td>:</td>
                                            <td>{deposit.payment_channel}</td>
                                        </tr>
                                        {deposit.account !== null && (
                                            <tr>
                                                <td className="font-bold">
                                                    Bank Akun
                                                </td>
                                                <td>:</td>
                                                <td>
                                                    {deposit.account.name} (
                                                    {deposit.account.bank_name})
                                                </td>
                                            </tr>
                                        )}
                                        {deposit.deposit_location !== null && (
                                            <tr>
                                                <td className="font-bold">
                                                    Lokasi Cash / Setor Tunai
                                                </td>
                                                <td>:</td>
                                                <td>
                                                    {
                                                        deposit.deposit_location
                                                            .name
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="font-bold">
                                                Jumlah
                                            </td>
                                            <td>:</td>
                                            <td>{deposit.amount}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">
                                                Admin Fee
                                            </td>
                                            <td>:</td>
                                            <td>
                                                Rp{' '}
                                                {formatIDR(+deposit.admin_fee)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">
                                                Status
                                            </td>
                                            <td>:</td>
                                            <td
                                                className={
                                                    deposit.status.text_color
                                                }
                                            >
                                                {deposit.status.text}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">
                                                Alasan Penolakan
                                            </td>
                                            <td>:</td>
                                            <td>{deposit.note}</td>
                                        </tr>
                                        {isEmpty(deposit.editor) === false && (
                                            <tr>
                                                <td className="font-bold">
                                                    Approver
                                                </td>
                                                <td>:</td>
                                                <td>{deposit.editor.name}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="font-bold">
                                                Tanggal
                                            </td>
                                            <td>:</td>
                                            <td>{deposit.format_created_at}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">
                                                Pembayaran Hutang
                                            </td>
                                            <td>:</td>
                                            <td>
                                                {isEmpty(
                                                    deposit.paylater
                                                        .not_fullpayment_reason
                                                ) === false ? (
                                                    <p>Sebagian</p>
                                                ) : (
                                                    <p>Penuh</p>
                                                )}
                                            </td>
                                        </tr>
                                        {isEmpty(
                                            deposit.paylater.next_payment
                                        ) === false && (
                                            <tr>
                                                <td className="font-bold">
                                                    Tanggal Pemenuhan
                                                </td>
                                                <td>:</td>
                                                <td>
                                                    {formatIDDate(
                                                        deposit.paylater
                                                            .next_payment
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div>
                                    {isEmpty(deposit.image_prove_url) ===
                                        false && (
                                        <div>
                                            <a
                                                href={deposit.image_prove_url}
                                                target="_blank"
                                            >
                                                <img
                                                    src={
                                                        deposit.image_prove_url
                                                    }
                                                    className="w-full object-fill h-96"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
