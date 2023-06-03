import React from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import { HiChevronLeft } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import FormInput from '@/Components/FormInput'
import Alert from '@/Components/Alert'
import { formatIDR } from '@/utils'

export default function Topup({ payments }) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            amount: '',
            payment: '',
        })

    const amounts = [20000, 50000, 100000, 200000, 300000, 500000]

    const isActiveAmount = (amount) => {
        return `px-3 py-3 border shadow-sm rounded ${
            +amount === +data.amount ? 'bg-blue-700 text-white' : ''
        }`
    }

    const setAmount = (amount) => {
        setData('amount', amount)
    }

    const isActivePayment = (payment) => {
        return `p-2 border shadow rounded flex flex-row items-center space-x-5 h-14 ${
            payment === data.payment ? 'bg-blue-600 text-white' : ''
        }`
    }

    const handleSubmit = () => {
        if (processing) {
            return
        }
        post(route('customer.deposit.topup'))
    }

    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('customer.deposit.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <div className="w-full px-5">
                    <div className="mb-2 font-bold">Pilih Nominal</div>
                    <div className="w-full grid grid-cols-3 gap-2 text-center">
                        {amounts.map((amount) => (
                            <div
                                key={amount}
                                className={isActiveAmount(amount)}
                                onClick={() => setAmount(amount)}
                            >
                                {formatIDR(amount)}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row items-center space-x-2 justify-between w-full px-5 py-5">
                    <div className="border-b flex-1"></div>
                    <div>ATAU</div>
                    <div className="border-b flex-1"></div>
                </div>
                <div className="w-full px-5">
                    <FormInput
                        placeholder="masukan nominal, minimal 10.000"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        error={errors.amount}
                    />
                </div>
                <div className="w-full px-5 mt-10 flex flex-col">
                    <div className="font-bold mb-2">Metode Pembayaran</div>
                    {errors.payment && (
                        <Alert type="error">Pilih metode pembayaran</Alert>
                    )}
                    <div className="mb-2" />
                    <div className="w-full flex flex-col space-y-2">
                        {payments.map((payment) => (
                            <div
                                key={payment.name}
                                className={isActivePayment(payment.name)}
                                onClick={() => setData('payment', payment.name)}
                            >
                                <input type="radio" />
                                {payment.logo === null ? (
                                    <p>{payment.display_name}</p>
                                ) : (
                                    <img
                                        src={payment.logo}
                                        className="h-7 object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-20 right-0 md:right-1/3 md:pl-10 max-w-md w-full">
                <div
                    onClick={handleSubmit}
                    className="border bg-blue-700 text-white px-5 py-2 mx-5 rounded-full hover:text-black hover:bg-white"
                >
                    Bayar
                </div>
            </div>
        </CustomerLayout>
    )
}
