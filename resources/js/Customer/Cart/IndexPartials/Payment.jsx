import React, { useState } from 'react'
import { usePage, router } from '@inertiajs/react'

import BottomSheet from '@/Customer/Components/BottomSheet'
import { toastError } from '@/Customer/utils'

const Payment = ({ state }) => {
    const {
        props: { payments },
    } = usePage()

    const [processing, setProcessing] = useState(false)

    const isEnable = (enable) => {
        if (enable) {
            return 'font-semibold h-11 border bg-blue-700 text-white px-5 py-2 rounded-full hover:text-black hover:bg-white'
        }
        return 'font-semibold h-11 border bg-gray-400 text-white px-5 py-2 rounded-full'
    }

    const pay = (payment) => {
        if (!payment.is_enable) {
            return
        }
        if (processing) {
            return
        }
        router.post(
            route('cart.purchase'),
            {
                payed_with: payment.name,
            },
            {
                onBefore: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            }
        )
    }

    return (
        <BottomSheet isOpen={state.isOpen} toggle={() => state.toggle()}>
            <div className="w-full flex flex-col pt-5 pb-28 px-4 gap-2">
                <div className="mb-2 font-bold text-lg">Opsi Pembayaran</div>
                {payments.map((payment) => (
                    <div
                        key={payment.name}
                        className={isEnable(payment.is_enable)}
                        onClick={() => pay(payment)}
                    >
                        {payment.display_name}
                    </div>
                ))}
            </div>
        </BottomSheet>
    )
}

export default Payment
