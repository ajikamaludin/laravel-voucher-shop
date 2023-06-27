import React, { useState } from 'react'
import { Head, useForm, router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import FormFile from '@/Components/FormFile'
import { HiCheckCircle, HiClock } from 'react-icons/hi2'

// 0 yuk verifikasi
const VerificationForm = () => {
    const {
        props: {
            auth: { user },
        },
    } = usePage()
    const [show, setShow] = useState(false)

    const { setData, post, errors } = useForm({ image: null })

    const handleSubmit = () => {
        post(route('customer.verification'))
    }

    return (
        <>
            <div className="px-4 text-gray-400">
                upgrade akun kamu untuk mendapatkan banefit lebih, cukup lakukan
                verifikasi data dengan upload foto KTP kamu
            </div>
            {show === false ? (
                <div
                    className="w-full px-4 mt-10"
                    onClick={() => setShow(true)}
                >
                    <div className="py-3 px-4 rounded-full border bg-blue-600 text-white hover:bg-gray-100 hover:text-black">
                        Verifikasi
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col px-5">
                    <FormFile
                        label="KTP"
                        onChange={(e) => setData('image', e.target.files[0])}
                        error={errors.image}
                        preview={
                            <img
                                src={`${user.identity_image_url}`}
                                className="w-full object-fill h-48 mb-1 "
                                alt="ktp image"
                                loading="lazy"
                            />
                        }
                    />

                    <div
                        className="py-3 px-4 rounded-full border bg-blue-600 text-white hover:bg-gray-100 hover:text-black"
                        onClick={() => handleSubmit()}
                    >
                        Upload
                    </div>
                </div>
            )}
        </>
    )
}

// 1 verified
const Verified = () => {
    return (
        <div className="flex flex-col w-full items-center my-auto">
            <HiCheckCircle className="h-32 w-32 text-green-500" />
            <div className="font-bold text-lg px-10 pt-5 text-center">
                Akun anda berhasil terverifikasi
            </div>
        </div>
    )
}

// 2 your data is in review
const VerificationInProgress = () => {
    return (
        <div className="flex flex-col w-full items-center my-auto">
            <HiClock className="h-32 w-32 text-gray-400 border rounded-full border-gray-600" />
            <div className="font-bold text-lg px-10 pt-5 text-center">
                Data anda sedang kami proses untuk verifikasi
            </div>
        </div>
    )
}

export default function Index({ auth: { user } }) {
    return (
        <CustomerLayout>
            <Head title="Upgrade Member" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="px-4 pt-10 text-2xl font-bold">
                    Upgrade Member
                </div>
                {+user.identity_verified === 0 && <VerificationForm />}
                {+user.identity_verified === 1 && <Verified />}
                {+user.identity_verified === 2 && <VerificationInProgress />}
            </div>
        </CustomerLayout>
    )
}
