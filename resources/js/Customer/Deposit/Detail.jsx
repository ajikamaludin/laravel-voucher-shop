import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HiChevronLeft, HiClipboardDocumentList } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import { PayButton } from './DetailPartials/PayButton'
import { FormUploadManual } from './DetailPartials/FormUploadManual'
import { FormUploadCashDeposit } from './DetailPartials/FormUploadCashDeposit'
import {
    PAYMENT_CASH_DEPOSIT,
    PAYMENT_MANUAL,
    PAYMENT_MIDTRANS,
    STATUS_REJECT,
    STATUS_EXPIRED,
} from '@/constant'
import { handleCopyToClipboard } from '../utils'

const ActionSection = ({ deposit }) => {
    if (deposit.is_valid === STATUS_EXPIRED) {
        return (
            <div className="w-full px-5">
                <div className="my-5">
                    <div className="bg-red-50 text-red-700 p-3 border rounded-md">
                        Expired
                    </div>
                </div>
            </div>
        )
    }

    if (deposit.is_valid === STATUS_REJECT) {
        return (
            <div className="w-full px-5">
                <div className="my-5">
                    <div className="bg-red-50 text-red-700 p-3 border rounded-md">
                        {deposit.note}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            {deposit.payment_channel === PAYMENT_MIDTRANS && <PayButton />}
            {deposit.payment_channel === PAYMENT_MANUAL && <FormUploadManual />}
            {deposit.payment_channel === PAYMENT_CASH_DEPOSIT && (
                <FormUploadCashDeposit />
            )}
        </div>
    )
}

export default function Detail({ deposit, back }) {
    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route(back))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>

                {/* detail */}
                <div className="flex flex-row  items-center pb-5 border-b px-5">
                    <div className="w-full">
                        <div
                            className="font-semibold text-xl text-gray-400 flex flex-row items-center w-full"
                            onClick={() =>
                                handleCopyToClipboard(deposit.description)
                            }
                        >
                            <div>{deposit.description}</div>
                            <div className="pl-3 text-gray-400">
                                <HiClipboardDocumentList />
                            </div>
                        </div>
                        <div className="font-bold text-3xl">
                            {deposit.amount}
                        </div>
                        <div className="text-gray-400">
                            {deposit.format_created_at}
                        </div>
                    </div>
                    <div>
                        <div
                            className={`text-xs ${deposit.status.text_color} `}
                        >
                            {deposit.status.text}
                        </div>
                    </div>
                </div>

                {/* action */}
                {deposit.is_valid !== 0 && <ActionSection deposit={deposit} />}
            </div>
        </CustomerLayout>
    )
}
