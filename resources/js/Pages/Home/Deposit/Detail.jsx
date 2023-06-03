import React, { useState, useEffect } from 'react'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import {
    HiChevronLeft,
    HiClipboard,
    HiClipboardDocumentList,
} from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import { formatIDR } from '@/utils'
import FormFile from '@/Components/FormFile'
import { isEmpty } from 'lodash'
import Alert from '@/Components/Alert'
import { toast } from 'react-toastify'

const PayButton = () => {
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

const FormUpload = () => {
    const {
        props: { accounts, deposit, flash },
    } = usePage()

    const [account, setAccount] = useState(null)
    const { data, setData, errors, processing, post } = useForm({
        account_id: '',
        image: null,
        image_url: deposit.image_prove_url,
    })

    const handleSelectAccount = (id) => {
        if (id === '') {
            setData('account_id', '')
            setAccount(null)
        }
        const account = accounts.find((acc) => acc.id === id)
        setData('account_id', account.id)
        setAccount(account)
    }

    const handleCopyToClipboard = (text) => {
        toast.success('copied to clipboard')
        navigator.clipboard.writeText(account.account_number)
    }

    const handleSubmit = () => {
        if (processing) {
            return
        }
        post(route('customer.deposit.update', deposit), {
            onSuccess: () =>
                setTimeout(
                    () => router.get(route(route().current(), deposit)),
                    3000
                ),
        })
    }

    return (
        <div className="px-5 mt-4">
            <div className="my-4">
                <Alert type={flash.message.type}>
                    <span className="font-semibold">
                        {flash.message.message}
                    </span>
                </Alert>
                <div className="mb-1 text-sm">Bank </div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => handleSelectAccount(e.target.value)}
                    value={data.account_id}
                    name="account_id"
                >
                    <option value=""></option>
                    {accounts.map((account) => (
                        <option value={account.id} key={account.id}>
                            {account.bank_name}
                        </option>
                    ))}
                </select>
            </div>
            {data.account_id !== '' && (
                <>
                    <div className="my-5">
                        <div className="bg-blue-50 text-blue-800 p-3 border rounded-md border-blue-400">
                            <div>Silahkan transfer nominal di atas ke</div>
                            <div>
                                <span className="font-bold">
                                    {account.bank_name}
                                </span>
                            </div>
                            <div>
                                Atas Nama :{' '}
                                <span className="font-bold">
                                    {account.holder_name}
                                </span>
                            </div>
                            <div
                                className="flex flex-row items-center space-x-1"
                                onClick={() =>
                                    handleCopyToClipboard(
                                        account.account_number
                                    )
                                }
                            >
                                <div>Nomor Rekening : </div>
                                <div className="font-bold">
                                    {account.account_number}
                                </div>
                                <HiClipboardDocumentList className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <FormFile
                        label={'Bukti Transfer'}
                        onChange={(e) => setData('image', e.target.files[0])}
                        error={errors.image}
                        preview={
                            isEmpty(data.image_url) == false && (
                                <img
                                    src={`${data.image_url}`}
                                    className="w-full h-52 mb-1"
                                    alt="bukti transfer"
                                />
                            )
                        }
                    />

                    <div
                        className="mt-10 w-full px-4 py-2 border rounded-full bg-blue-600 text-white hover:bg-white hover:text-black"
                        onClick={() => handleSubmit()}
                    >
                        Upload
                    </div>
                </>
            )}
        </div>
    )
}

const ActionSection = ({ deposit }) => {
    return (
        <div className="w-full">
            {deposit.payment_channel === 'MIDTRANS' ? (
                <PayButton />
            ) : (
                <FormUpload />
            )}
        </div>
    )
}

export default function Detail({ deposit }) {
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

                {/* detail */}
                <div className="flex flex-row justify-between items-center pb-5 border-b px-5">
                    <div>
                        <div className="font-semibold text-xl text-gray-400">
                            {deposit.description}
                        </div>
                        <div className="font-bold text-3xl">
                            Rp {formatIDR(deposit.amount)}
                        </div>
                        <div className="text-gray-400">
                            {deposit.format_created_at}
                        </div>
                    </div>
                    <div>
                        <div
                            className={`text-xs px-2 py-1 rounded-full border ${deposit.status.color} text-white`}
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
