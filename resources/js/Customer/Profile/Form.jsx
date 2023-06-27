import React from 'react'
import { Head, useForm, Link, router } from '@inertiajs/react'
import { FcGoogle } from 'react-icons/fc'

import CustomerLayout from '@/Layouts/CustomerLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import Alert from '@/Components/Alert'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'
import FormFile from '@/Components/FormFile'

export default function Index({ auth: { user }, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        username: user.username,
        password: '',
        password_confirmation: '',
        fullname: user.fullname,
        name: user.name,
        address: user.address,
        phone: user.phone,
        image: null,
        image_url: user.image_url,
    })

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const handleSubmit = () => {
        post(route('customer.profile.show'), {
            onSuccess: () =>
                setTimeout(() => router.get(route(route().current())), 3000),
        })
    }

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <CustomerLayout>
            <Head title="Update Profile" />
            <div className="flex flex-col min-h-[calc(90dvh)]">
                <div className="m-4 p-2">
                    <div className="text-2xl font-bold mb-4">Profile</div>
                    <Alert type={flash.message.type}>
                        <span className="font-semibold">
                            {flash.message.message}
                        </span>
                    </Alert>
                    <div className="w-full">
                        <FormInput
                            placeholder="nama lengkap"
                            name="fullname"
                            value={data.fullname}
                            onChange={handleOnChange}
                            error={errors.fullname}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="nama lengkap"
                        />
                    </div>
                    <div className="w-full">
                        <FormInput
                            placeholder="nama panggilan"
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            error={errors.name}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="nama panggilan"
                        />
                    </div>
                    <FormInputWith
                        type="number"
                        leftItem={<div className="text-sm">+62</div>}
                        placeholder="whatsapp"
                        name="phone"
                        value={data.phone}
                        onChange={handleOnChange}
                        error={errors.phone}
                        onKeyDownCapture={(e) => handleKeyDown(e)}
                        formClassName={'pl-10'}
                        label="whatsapp"
                    />
                    <div className="w-full">
                        <TextArea
                            placeholder="alamat lengkap"
                            name="address"
                            value={data.address}
                            onChange={handleOnChange}
                            error={errors.address}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="alamat lengkap"
                        />
                    </div>
                    <div className="w-full">
                        <FormInput
                            placeholder="username"
                            name="username"
                            value={data.username}
                            onChange={handleOnChange}
                            error={errors.username}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="username"
                        />
                    </div>
                    <div className="w-full">
                        <FormInput
                            type="password"
                            placeholder="password , leave blank if unchange"
                            name="password"
                            value={data.password}
                            onChange={handleOnChange}
                            error={errors.password}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="password"
                        />
                    </div>
                    <div className="w-full">
                        <FormInput
                            type="password"
                            placeholder="retype password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleOnChange}
                            error={errors.password_confirmation}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
                            label="password confirm"
                        />
                    </div>
                    <div className="w-full text-sm font-medium">
                        <div className="mb-2">email </div>
                        <div className="px-2 py-2.5 border rounded-md bg-gray-200">
                            {user.email}
                        </div>
                    </div>
                    <div className="w-full">
                        <FormFile
                            label={'Profile Image'}
                            onChange={(e) =>
                                setData('image', e.target.files[0])
                            }
                            error={errors.image}
                            preview={
                                <img
                                    src={`${data.image_url}`}
                                    className="w-20 h-20 mb-1 rounded-full"
                                    alt="profile image"
                                    loading="lazy"
                                />
                            }
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between">
                        <Button processing={processing} onClick={handleSubmit}>
                            Simpan
                        </Button>
                        {/* <a href="#" className="text-sm underline text-blue-600">
                            forgot password
                        </a> */}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
