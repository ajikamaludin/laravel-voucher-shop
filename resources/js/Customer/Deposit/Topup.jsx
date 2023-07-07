import React from 'react'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { HiCheck, HiChevronLeft } from 'react-icons/hi2'

import { formatIDR } from '@/utils'
import { useModalState } from '@/hooks'
import { CASH_DEPOSIT } from '@/Customer/utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import Alert from '@/Components/Alert'
import FormInputNumericWith from '@/Components/FormInputNumericWith'
import BottomSheet from '../Components/BottomSheet'

const PaymentInfoBottomSheet = ({ state }) => {
    const {
        props: { payments },
    } = usePage()
    return (
        <BottomSheet isOpen={state.isOpen} toggle={() => state.toggle()}>
            <div className="w-full flex flex-col pt-5 pb-28 px-4 gap-2">
                {payments.map((payment) => (
                    <div className="flex flex-col" key={payment.name}>
                        <div className="font-bold">{payment.display_name}</div>
                        <div>{payment.open_hours}</div>
                        {payment.name === CASH_DEPOSIT && (
                            <Link
                                href={route('customer.deposit-location.index')}
                                className="flex flex-row items-center w-full gap-1"
                            >
                                <div>Sesuai lokasi Setor Tunai </div>
                                <div className="text-blue-400">(Lihat)</div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </BottomSheet>
    )
}

export default function Topup({ payments }) {
    const paymentInfoModal = useModalState()

    const { data, setData, post, processing, errors } = useForm({
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
        return `p-2 border shadow rounded flex flex-row items-center space-x-5 my-1  ${
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
            <div className="flex flex-col min-h-[calc(90dvh)] pb-20">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('transactions.deposit.index'))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <div className="w-full hidden">
                    <div className="w-full px-5">
                        <div className="mb-2 font-bold">Pilih Nominal</div>
                        <div className="w-full grid grid-cols-3 gap-2 text-center">
                            {amounts.map((amount) => (
                                <div
                                    key={amount}
                                    className={isActiveAmount(amount)}
                                    onClick={() => setAmount(amount)}
                                >
                                    Rp{formatIDR(amount)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-2 justify-between w-full px-5 py-5">
                        <div className="border-b flex-1"></div>
                        <div>ATAU</div>
                        <div className="border-b flex-1"></div>
                    </div>
                </div>
                <div className="w-full px-5">
                    <div className="mb-2 font-bold">Masukan Nominal</div>
                    <FormInputNumericWith
                        placeholder="masukan nominal, minimal 10.000"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        error={errors.amount}
                        className={'pl-10'}
                        leftItem={<div className="text-sm">Rp</div>}
                    />
                </div>
                <div className="w-full px-5 mt-10 flex flex-col">
                    <div className="font-bold mb-2">Metode Pembayaran</div>
                    {errors.payment && (
                        <Alert type="error">Pilih metode pembayaran</Alert>
                    )}
                    <div className="mb-2" />
                    <div className="w-full flex flex-col">
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
                                                loading="lazy"
                                            />
                                        )}
                                        <div
                                            className={
                                                isActivePaymentAdminFee(
                                                    payment.name
                                                ) + 'text-black'
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: payment.tagline,
                                            }}
                                        />

                                        {+payment.admin_fee !== 0 ? (
                                            <p
                                                className={isActivePaymentAdminFee(
                                                    payment.name
                                                )}
                                            >
                                                Biaya admin: Rp{' '}
                                                {formatIDR(payment.admin_fee)}
                                            </p>
                                        ) : (
                                            <p
                                                className={isActivePaymentAdminFee(
                                                    payment.name
                                                )}
                                            >
                                                Biaya admin: Gratis
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {payment.name === CASH_DEPOSIT && (
                                    <Link
                                        href={route(
                                            'customer.deposit-location.index'
                                        )}
                                        className="flex flex-row items-center w-full text-sm text-gray-400 pt-1 gap-1"
                                    >
                                        <div>Info lokasi Setor Tunai </div>
                                        <div className="text-blue-400">
                                            (Lihat)
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div
                            className="flex flex-row items-center w-full text-sm text-gray-400 pt-1 gap-1"
                            onClick={() => paymentInfoModal.toggle()}
                        >
                            <div>Info Aktif Metode Pembayaran </div>
                            <div className="text-blue-400">(Lihat)</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-12 w-full bg-white py-5 px-2 shadow-lg border-t max-w-md mx-auto">
                {payments.length > 0 && (
                    <div
                        onClick={handleSubmit}
                        className="bg-blue-700 text-white text-center px-5 py-2 mx-auto rounded-lg hover:text-black hover:bg-white max-w-sm"
                    >
                        Lanjutkan Pembayaran
                    </div>
                )}
            </div>
            <PaymentInfoBottomSheet state={paymentInfoModal} />
        </CustomerLayout>
    )
}
