import React, { useState, useEffect } from 'react'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { isEmpty } from 'lodash'
import {
    HiChevronLeft,
    HiClipboardDocumentList,
    HiOutlineClipboardDocumentCheck,
    HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

import { toastSuccess } from '../utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import FormFile from '@/Components/FormFile'
import Alert from '@/Components/Alert'
import { formatIDR } from '@/utils'
import { STATUS_REJECT } from '@/constant'

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

    const [imageUrl, setImageUrl] = useState(deposit.image_prove_url)
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
            return
        }
        const account = accounts.find((acc) => acc.id === id)
        setData('account_id', account.id)
        setAccount(account)
    }

    const handleCopyToClipboard = (text) => {
        toastSuccess('copied to clipboard')
        navigator.clipboard.writeText(text)
    }

    const handleSubmit = () => {
        if (processing) {
            return
        }
        post(route('transactions.deposit.update', deposit), {
            replace: true,
            preserveState: true,
            onSuccess: () =>
                setTimeout(
                    () => router.get(route(route().current(), deposit)),
                    3000
                ),
        })
    }

    useEffect(() => {
        if (deposit.account !== null) {
            handleSelectAccount(deposit.account.id)
        }
    }, [deposit])

    if (isEmpty(imageUrl) == false) {
        return (
            <div className="px-5 mt-2">
                <div className="font-bold">Bukti Transfer</div>
                <img
                    src={`${imageUrl}`}
                    className="w-full h-52 mb-1"
                    alt="bukti transfer"
                />
                <div
                    className="mt-10 w-full px-4 py-2 border rounded-full bg-blue-600 text-white hover:bg-white hover:text-black"
                    onClick={() => setImageUrl(null)}
                >
                    Ubah Bukti Transfer
                </div>
            </div>
        )
    }

    return (
        <div className="px-5 mt-4">
            <div className="my-4">
                <Alert type={flash.message.type}>
                    <span className="font-semibold">
                        {flash.message.message}
                    </span>
                </Alert>
                <div className="mb-1 font-bold">Bank</div>

                {account !== null ? (
                    <div className="flex flex-row w-full gap-2">
                        <div
                            className="px-3 py-2 border rounded-md flex-1 flex flex-row items-center gap-1 shadow-md hover:bg-gray-100"
                            onClick={() => handleSelectAccount(account.id)}
                        >
                            <div className="w-1/3">
                                <img
                                    src={account.logo_url}
                                    alt="logo bank"
                                    className="h-10"
                                />
                            </div>
                            <div>
                                {account.name} - {account.bank_name}
                            </div>
                        </div>
                        <div
                            className="text-center border flex flex-row rounded-md shadow-md items-center justify-center px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleSelectAccount('')}
                        >
                            <div>Ubah</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="px-3 py-2 border rounded-md flex flex-row w-full items-center gap-1 shadow-md hover:bg-gray-100"
                                onClick={() => handleSelectAccount(account.id)}
                            >
                                <div className="w-1/3">
                                    <img
                                        src={account.logo_url}
                                        alt="logo bank"
                                        className="h-10"
                                    />
                                </div>
                                <div>
                                    {account.name} - {account.bank_name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {account !== null && (
                <>
                    <div className="my-5">
                        <div className="bg-blue-50 text-blue-700 p-3 border rounded-md">
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
                                <div className="font-bold pr-2">
                                    {account.account_number}
                                </div>
                                <HiOutlineClipboardDocumentList className=" w-5 h-5 text-blue-600" />
                            </div>
                            <div className="font-bold mt-5">Rincian</div>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-1/3">
                                            Jumlah Deposit
                                        </td>
                                        <td>: </td>
                                        <td className="text-right">
                                            <span className="font-bold">
                                                {deposit.amount}
                                            </span>
                                        </td>
                                        <td className="w-5" />
                                    </tr>
                                    <tr>
                                        <td>Biaya Admin</td>
                                        <td>: </td>
                                        <td className="text-right">
                                            <span className="font-bold">
                                                {+account.admin_fee === 0 ? (
                                                    'Gratis'
                                                ) : (
                                                    <>
                                                        Rp.{' '}
                                                        {formatIDR(
                                                            +account.admin_fee
                                                        )}
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="w-5" />
                                    </tr>
                                    <tr
                                        onClick={() =>
                                            handleCopyToClipboard(
                                                +account.admin_fee +
                                                    +deposit.debit
                                            )
                                        }
                                    >
                                        <td>Total Transfer</td>
                                        <td> : </td>
                                        <td className="text-right">
                                            <span className="font-bold">
                                                Rp.{' '}
                                                {formatIDR(
                                                    +account.admin_fee +
                                                        +deposit.debit
                                                )}
                                            </span>
                                        </td>
                                        <td className="w-5">
                                            <HiOutlineClipboardDocumentList className=" w-5 h-5 text-blue-600" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="-mb-3">
                        <div className="font-bold">Bukti Transfer</div>
                        {isEmpty(data.image_url) == false && (
                            <img
                                src={`${data.image_url}`}
                                className="w-full h-52 mb-1"
                                alt="bukti transfer"
                            />
                        )}
                    </div>
                    <FormFile
                        onChange={(e) => setData('image', e.target.files[0])}
                        error={errors.image}
                    />
                    <div className="mb-1 -mt-4 text-sm font-medium text-gray-500">
                        upload gambar dalam ekstensi jpg, png, jpeg
                    </div>

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
                        router.get(route('transactions.deposit.index'))
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
                            {deposit.amount}
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
