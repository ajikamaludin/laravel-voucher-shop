import React from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { HiCheck, HiChevronLeft, HiQuestionMarkCircle } from 'react-icons/hi2'

import { formatIDR } from '@/utils'
import { CASH_DEPOSIT } from '@/Customer/utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import Alert from '@/Components/Alert'
import FormInputNumeric from '@/Components/FormInputNumeric'

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

    const isActivePaymentAdminFee = (payment) => {
        return `text-xs ${
            payment === data.payment ? 'text-white' : 'text-gray-400'
        }`
    }

    const handleSetPayment = (payment) => {
        setData('payment', payment.name)
    }

    const handleSubmit = () => {
        if (processing) {
            return
        }
        post(route('transactions.deposit.topup'))
    }

    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('transactions.deposit.index'))
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
                    <FormInputNumeric
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
                        {payments.length <= 0 && (
                            <Alert type="error">
                                Sistem pembayaran non-aktif{' '}
                            </Alert>
                        )}
                        {payments.map((payment) => (
                            <div
                                className="flex flex-col w-full"
                                key={payment.name}
                            >
                                <div
                                    className={isActivePayment(payment.name)}
                                    onClick={() => handleSetPayment(payment)}
                                >
                                    {payment.name === data.payment ? (
                                        <div className="w-5 h-5 rounded-md border">
                                            <HiCheck />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-md border"></div>
                                    )}
                                    <div className="flex flex-col">
                                        {payment.logo === null ? (
                                            <p>{payment.display_name}</p>
                                        ) : (
                                            <img
                                                src={payment.logo}
                                                className="h-7 pt-1 object-cover"
                                            />
                                        )}
                                        {+payment.admin_fee !== 0 && (
                                            <p
                                                className={isActivePaymentAdminFee(
                                                    payment.name
                                                )}
                                            >
                                                biaya admin:{' '}
                                                {formatIDR(payment.admin_fee)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {payment.name === CASH_DEPOSIT && (
                                    <Link
                                        href={route(
                                            'customer.deposit-location.index'
                                        )}
                                        className="flex flex-row items-center w-full text-sm text-gray-400 py-2 gap-1"
                                    >
                                        <div>Daftar lokasi setor tunai</div>
                                        <div className="text-blue-400">
                                            ada disini
                                        </div>
                                        <div>
                                            <HiQuestionMarkCircle />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-20 right-0 w-full px-2">
                {payments.length > 0 && (
                    <div
                        onClick={handleSubmit}
                        className="bg-blue-700 text-white px-5 py-2 mx-auto rounded-full hover:text-black hover:bg-white max-w-sm"
                    >
                        Bayar
                    </div>
                )}
            </div>
        </CustomerLayout>
    )
}
