import React, { useEffect } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import { STATUS_APPROVE, STATUS_REJECT } from '@/constant'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'

export default function FormModal(props) {
    const { modalState } = props
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            amount: '',
            image_prove_url: '',
            status: '',
            account: {
                name: '',
                bank_name: '',
                holder_name: '',
                account_number: '',
            },
            deposit_location: null,
            payment_channel: '',
            is_valid: 0,
            status_text: '',
            text_color: '',
            customer: '',
            description: '',
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

    const handleReset = () => {
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const deposit = modalState.data
        post(route('deposit.update', deposit), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const deposit = modalState.data
        if (isEmpty(deposit) === false) {
            setData({
                amount: deposit.amount,
                account: deposit.account,
                image_prove_url: deposit.image_prove_url,
                payment_channel: deposit.payment_channel,
                is_valid: deposit.is_valid,
                status_text: deposit.status.text,
                text_color: deposit.status.text_color,
                customer: deposit.customer,
                description: deposit.description,
                reject_reason: deposit.note,
                deposit_location: deposit.deposit_location,
            })
            return
        }
    }, [modalState])

    return (
        <Modal
            isOpen={modalState.isOpen}
            toggle={handleClose}
            title={'Deposit'}
        >
            <table className="relative w-full overflow-x-auto p-2 rounded">
                <tbody>
                    <tr>
                        <td className="font-bold">Customer</td>
                        <td>:</td>
                        <td>
                            <Link
                                href={route('customer.edit', {
                                    customer: data.customer,
                                })}
                                className="hover:underline"
                            >
                                {data.customer.name}
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Deskripsi</td>
                        <td>:</td>
                        <td>{data.description}</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Metode Pembayaran</td>
                        <td>:</td>
                        <td>{data.payment_channel}</td>
                    </tr>
                    {data.account !== null && (
                        <tr>
                            <td className="font-bold">Bank Akun</td>
                            <td>:</td>
                            <td>
                                {data.account.name} ({data.account.bank_name})
                            </td>
                        </tr>
                    )}
                    {data.deposit_location !== null && (
                        <tr>
                            <td className="font-bold">
                                Lokasi Cash / Setor Tunai
                            </td>
                            <td>:</td>
                            <td>{data.deposit_location.name}</td>
                        </tr>
                    )}
                    <tr>
                        <td className="font-bold">Jumlah</td>
                        <td>:</td>
                        <td>{data.amount}</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Status</td>
                        <td>:</td>
                        <td className={data.text_color}>{data.status_text}</td>
                    </tr>
                    {+data.is_valid === STATUS_REJECT && (
                        <tr>
                            <td className="font-bold">Alasan Penolakan</td>
                            <td>:</td>
                            <td>{data.reject_reason}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isEmpty(data.image_prove_url) === false && (
                <div>
                    <a href={data.image_prove_url} target="_blank">
                        <img
                            src={data.image_prove_url}
                            className="w-full object-fill h-96"
                            loading="lazy"
                        />
                    </a>
                </div>
            )}
            {+data.is_valid !== STATUS_APPROVE &&
                +data.is_valid !== STATUS_REJECT && (
                    <>
                        <div className="my-4">
                            <div className="mb-1 text-sm">Status </div>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={handleOnChange}
                                value={+data.status}
                                name="status"
                            >
                                <option value=""> -- pilih status -- </option>
                                <option value={STATUS_APPROVE}>Approve</option>
                                <option value={STATUS_REJECT}>Reject</option>
                            </select>
                            {errors.status && (
                                <div className="text-sm text-red-500">
                                    {errors.status}
                                </div>
                            )}
                        </div>
                        {+data.status === STATUS_REJECT && (
                            <FormInput
                                label="Alasan penolakan"
                                name="reject_reason"
                                value={data.reject_reason}
                                onChange={handleOnChange}
                                error={errors.reject_reason}
                            />
                        )}
                        <div className="flex items-center">
                            <Button
                                onClick={handleSubmit}
                                processing={processing}
                            >
                                Simpan
                            </Button>
                            <Button onClick={handleClose} type="secondary">
                                Batal
                            </Button>
                        </div>
                    </>
                )}
        </Modal>
    )
}
