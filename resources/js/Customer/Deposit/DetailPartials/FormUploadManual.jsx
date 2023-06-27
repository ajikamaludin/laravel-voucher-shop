import React, { useState, useEffect } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { isEmpty } from 'lodash'

import { toastSuccess } from '@/Customer/utils'
import { formatIDR } from '@/utils'
import FormFile from '@/Components/FormFile'
import Alert from '@/Components/Alert'

export const FormUploadManual = () => {
    const {
        props: { accounts, deposit, flash, bank_admin_fee },
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
                    loading="lazy"
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
                                    loading="lazy"
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
                                        loading="lazy"
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
                                                {+bank_admin_fee === 0 ? (
                                                    'Gratis'
                                                ) : (
                                                    <>
                                                        Rp.{' '}
                                                        {formatIDR(
                                                            +bank_admin_fee
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
                                                +bank_admin_fee + +deposit.debit
                                            )
                                        }
                                    >
                                        <td>Total Transfer</td>
                                        <td> : </td>
                                        <td className="text-right">
                                            <span className="font-bold">
                                                Rp.{' '}
                                                {formatIDR(
                                                    +bank_admin_fee +
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
                                loading="lazy"
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
