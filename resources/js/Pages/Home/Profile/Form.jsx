import React from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
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
        post(route('customer.show'))
    }

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <CustomerLayout>
            <Head title="Login" />
            <div className="flex flex-col min-h-screen">
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
                    />
                    <div className="w-full">
                        <TextArea
                            placeholder="alamat lengkap"
                            name="address"
                            value={data.address}
                            onChange={handleOnChange}
                            error={errors.address}
                            onKeyDownCapture={(e) => handleKeyDown(e)}
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
                        />
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
                                    className="w-40 mb-1"
                                    alt="site logo"
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
