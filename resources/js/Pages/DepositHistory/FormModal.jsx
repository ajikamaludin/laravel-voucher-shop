import React, { useEffect } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import RoleSelectionInput from '../Role/SelectionInput'

import { isEmpty } from 'lodash'

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
            payment_channel: '',
            is_valid: 0,
            status_text: '',
            text_color: '',
            customer_name: '',
            customer_phone: '',
            description: '',
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
                customer_name: `${deposit.customer.name} ( ${
                    deposit.customer.phone ?? deposit.customer.email
                } )`,
                description: deposit.description,
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
            <table className="relative w-full overflow-x-auto border-collapse border p-2 rounded">
                <tbody>
                    <tr>
                        <td className="font-bold">Customer</td>
                        <td>:</td>
                        <td>{data.customer_name}</td>
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
                </tbody>
            </table>

            {isEmpty(data.image_prove_url) === false && (
                <div>
                    <img
                        src={data.image_prove_url}
                        className="w-full object-fill h-96"
                    />
                </div>
            )}
            {+data.is_valid !== 0 && (
                <>
                    <div className="my-4">
                        <div className="mb-1 text-sm">Status </div>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={handleOnChange}
                            value={+data.status}
                            name="status"
                        >
                            <option value=""></option>
                            <option value={0}>Approve</option>
                            <option value={5}>Reject</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <Button onClick={handleSubmit} processing={processing}>
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
