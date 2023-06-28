import React, { useState, useEffect } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import { isEmpty } from 'lodash'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'

import { formatIDR } from '@/utils'
import { toastSuccess } from '@/Customer/utils'
import FormFile from '@/Components/FormFile'
import Alert from '@/Components/Alert'

export const FormUploadCashDeposit = () => {
    const {
        props: { deposit_locations, deposit, flash, cash_admin_fee },
    } = usePage()

    const [imageUrl, setImageUrl] = useState(deposit.image_prove_url)
    const [location, setLocation] = useState(null)
    const { data, setData, errors, processing, post } = useForm({
        deposit_location_id: '',
        image: null,
        image_url: deposit.image_prove_url,
    })

    const handleSelectLocation = (id) => {
        if (id === '') {
            setData('deposit_location_id', '')
            setLocation(null)
            return
        }
        const location = deposit_locations.find((acc) => acc.id === id)
        setData('deposit_location_id', location.id)
        setLocation(location)
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
                    500
                ),
        })
    }

    useEffect(() => {
        if (deposit.deposit_location !== null) {
            handleSelectLocation(deposit.deposit_location_id)
        }
    }, [deposit])

    if (isEmpty(imageUrl) == false) {
        return (
            <div className="px-5 mt-2">
                <div className="font-bold">Bukti Pembayaran</div>
                <img
                    src={`${imageUrl}`}
                    loading="lazy"
                    className="w-full mb-1"
                    alt="bukti Pembayaran"
                />
                <div
                    className="mt-10 w-full px-4 py-2 border rounded-full bg-blue-600 text-white hover:bg-white hover:text-black"
                    onClick={() => setImageUrl(null)}
                >
                    Ubah Bukti Pembayaran
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
                <div className="mb-1 font-bold">Lokasi Pembayaran</div>

                {location !== null ? (
                    <div className="flex flex-row w-full gap-2">
                        <div
                            className="px-3 py-2 border rounded-md flex-1 flex flex-row items-center gap-1 shadow-md hover:bg-gray-100"
                            onClick={() => handleSelectLocation(location.id)}
                        >
                            <div>
                                <img
                                    src={location.image_url}
                                    alt="image location"
                                    loading="lazy"
                                    className="object-fill h-36 w-32"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="font-bold">{location.name}</div>
                                <div>
                                    <span>+62{location.phone}</span>
                                </div>
                                <div>
                                    Alamat : <span>{location.address}</span>
                                </div>
                                <div>
                                    Jam Buka :{' '}
                                    <span className="font-bold">
                                        {location.operational_hour}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-center border flex flex-row rounded-md shadow-md items-center justify-center px-3 py-2 hover:bg-gray-100 h-10"
                            onClick={() => handleSelectLocation('')}
                        >
                            <div>Ubah</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {deposit_locations.map((location) => (
                            <div
                                key={location.id}
                                className="px-3 py-2 border rounded-md flex flex-row w-full items-center gap-1 shadow-md hover:bg-gray-100"
                                onClick={() =>
                                    handleSelectLocation(location.id)
                                }
                            >
                                <div>
                                    <img
                                        src={location.image_url}
                                        alt="image location"
                                        loading="lazy"
                                        className="object-fill h-36 w-32"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="font-bold">
                                        {location.name}
                                    </div>
                                    <div>
                                        <span>+62{location.phone}</span>
                                    </div>
                                    <div>
                                        Alamat : <span>{location.address}</span>
                                    </div>
                                    <div>
                                        Jam Buka :{' '}
                                        <span className="font-bold">
                                            {location.operational_hour}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {location !== null && (
                <>
                    <div className="my-5">
                        <div className="bg-blue-50 text-blue-700 p-3 border rounded-md">
                            <div>
                                <span className="font-bold">
                                    {location.name}
                                </span>
                            </div>
                            <div>Alamat : {location.address}</div>
                            <div
                                className="flex flex-row items-center space-x-1"
                                onClick={() =>
                                    handleCopyToClipboard(
                                        '+62' + location.phone
                                    )
                                }
                            >
                                <div>Whatsapp : </div>
                                <div className="font-bold pr-2">
                                    +62{location.phone}
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
                                                {+cash_admin_fee === 0 ? (
                                                    'Gratis'
                                                ) : (
                                                    <>
                                                        Rp.{' '}
                                                        {formatIDR(
                                                            +cash_admin_fee
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
                                                +cash_admin_fee + +deposit.debit
                                            )
                                        }
                                    >
                                        <td>Total Bayar</td>
                                        <td> : </td>
                                        <td className="text-right">
                                            <span className="font-bold">
                                                Rp.{' '}
                                                {formatIDR(
                                                    +cash_admin_fee +
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
                        <div className="font-bold">Bukti Pembayaran</div>
                        {isEmpty(data.image_url) == false && (
                            <img
                                src={`${data.image_url}`}
                                loading="lazy"
                                className="w-full h-52 mb-1"
                                alt="bukti Pembayaran"
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
