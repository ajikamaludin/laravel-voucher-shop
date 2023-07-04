import React, { useEffect } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import {
    STATUS_APPROVE,
    STATUS_REJECT,
    STATUS_WAIT_APPROVE,
    STATUS_WAIT_UPLOAD,
} from '@/constant'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import FormInputNumeric from '@/Components/FormInputNumeric'
import { formatIDDate, formatIDR } from '@/utils'

export default function Form(props) {
    const { deposit } = props

    const { data, setData, post, processing, errors } = useForm({
        debit: 0,
        is_valid: 0,
        reject_reason: '',
    })

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const showForm =
        +deposit.is_valid === STATUS_WAIT_APPROVE ||
        +deposit.is_valid === STATUS_WAIT_UPLOAD

    const handleSubmit = () => {
        post(route('paylater.repay.update', deposit))
    }

    useEffect(() => {
        if (isEmpty(deposit) === false) {
            setData({
                debit: deposit.debit,
                is_valid: deposit.is_valid,
                reject_reason: deposit.reject_reason,
            })
            return
        }
    }, [deposit])

    return (
        <AuthenticatedLayout
            page={'Pembayaran Hutang'}
            action={deposit.description}
            parent={route('paylater.repay.index')}
        >
            <Head title="Pembayaran Hutang" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            {deposit.description}
                        </div>
                        <table className="relative w-full overflow-x-auto p-2 rounded">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Customer</td>
                                    <td>:</td>
                                    <td>
                                        <Link
                                            href={route('mitra.edit', {
                                                customer: deposit.customer,
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
                                        <td className="font-bold">Bank Akun</td>
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
                                        <td>{deposit.deposit_location.name}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="font-bold">Jumlah</td>
                                    <td>:</td>
                                    <td>{deposit.amount}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Admin Fee</td>
                                    <td>:</td>
                                    <td>Rp {formatIDR(+deposit.admin_fee)}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Status</td>
                                    <td>:</td>
                                    <td className={deposit.status.text_color}>
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
                                        <td className="font-bold">Approver</td>
                                        <td>:</td>
                                        <td>{deposit.editor.name}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="font-bold">Tanggal</td>
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
                                {isEmpty(deposit.paylater.next_payment) ===
                                    false && (
                                    <tr>
                                        <td className="font-bold">
                                            Tanggal Pemenuhan
                                        </td>
                                        <td>:</td>
                                        <td>
                                            {formatIDDate(
                                                deposit.paylater.next_payment
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {isEmpty(deposit.image_prove_url) === false && (
                            <div>
                                <a
                                    href={deposit.image_prove_url}
                                    target="_blank"
                                >
                                    <img
                                        src={deposit.image_prove_url}
                                        className="w-full object-contain h-96"
                                        loading="lazy"
                                    />
                                </a>
                            </div>
                        )}
                        {showForm && (
                            <>
                                <div className="my-4">
                                    <FormInputNumeric
                                        type="number"
                                        label="Jumlah"
                                        name="debit"
                                        onChange={handleOnChange}
                                        value={data.debit}
                                        error={errors.debit}
                                    />
                                    <div className="mb-1 text-sm">Status</div>
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={handleOnChange}
                                        value={+data.is_valid}
                                        name="is_valid"
                                    >
                                        <option value="">
                                            {' '}
                                            -- pilih status --{' '}
                                        </option>
                                        <option value={STATUS_APPROVE}>
                                            Approve
                                        </option>
                                        <option value={STATUS_REJECT}>
                                            Reject
                                        </option>
                                    </select>
                                    {errors.status && (
                                        <div className="text-sm text-red-500">
                                            {errors.status}
                                        </div>
                                    )}
                                    {errors.reject_reason && (
                                        <div className="text-sm text-red-500">
                                            {errors.reject_reason}
                                        </div>
                                    )}
                                </div>
                                {+data.is_valid === STATUS_REJECT && (
                                    <FormInput
                                        label="Alasan penolakan"
                                        name="reject_reason"
                                        value={data.reject_reason}
                                        onChange={handleOnChange}
                                        error={errors.reject_reason}
                                    />
                                )}

                                <div className="mt-8">
                                    <Button
                                        onClick={handleSubmit}
                                        processing={processing}
                                    >
                                        Simpan
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
