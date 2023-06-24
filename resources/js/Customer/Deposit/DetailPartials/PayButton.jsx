import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'

import Alert from '@/Components/Alert'

export const PayButton = () => {
    const {
        props: { deposit, midtrans_client_key, is_production, direct, flash },
    } = usePage()

    const [loading, setLoading] = useState(false)

    const handleResult = (result) => {
        fetch(route('api.midtrans.payment', deposit), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result }),
        }).finally(() => {
            router.get(route(route().current(), deposit))
        })
    }

    const onClickPay = () => {
        if (loading) {
            return
        }
        setLoading(true)
        window.snap.pay(deposit.payment_token, {
            // Optional
            onSuccess: function (result) {
                console.log(result)
                handleResult(result)
                setLoading(false)
            },
            // Optional
            onPending: function (result) {
                console.log(result)
                handleResult(result)
                setLoading(false)
            },
            // Optional
            onError: function (result) {
                console.log(result)
                handleResult(result)
                setLoading(false)
            },
            onClose: function () {
                setLoading(false)
            },
        })
    }

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        let midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
        if (is_production) {
            midtransScriptUrl = 'https://app.midtrans.com/snap/snap.js'
        }
        //change this according to your client-key
        let scriptTag = document.createElement('script')
        scriptTag.src = midtransScriptUrl
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', midtrans_client_key)

        document.body.appendChild(scriptTag)

        if (direct === 'true') {
            setTimeout(() => {
                onClickPay()
            }, 1000)
        }

        return () => {
            document.body.removeChild(scriptTag)
        }
    }, [])

    return (
        <div className="w-full px-5 py-10">
            <Alert type={flash.message.type}>
                <span className="font-semibold">{flash.message.message}</span>
            </Alert>
            <div
                className="px-4 py-2 bg-blue-700 text-white rounded-full border hover:bg-white hover:text-black"
                onClick={onClickPay}
            >
                Bayar
            </div>
        </div>
    )
}
