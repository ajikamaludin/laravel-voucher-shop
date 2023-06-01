import React from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { FcGoogle } from 'react-icons/fc'

import CustomerLayout from '@/Layouts/CustomerLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import Alert from '@/Components/Alert'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'

export default function Index({ app_name, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        fullname: '',
        name: '',
        address: '',
        phone: '',
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
        post(route('customer.register'))
    }

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            handleSubmit()
        }
    }

    const handleLoginWithGoogle = () => {
        window.location = route('customer.login.google')
    }

    return (
        <CustomerLayout>
            <Head title="Register" />
            <div className="flex flex-col justify-center min-h-[calc(90dvh)]">
                <div className="m-4 border shadow-md p-6 pt-4">
                    <div className="text-2xl font-bold mb-4">Register</div>
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
                            placeholder="password"
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
                    <div className="w-full flex flex-row justify-between">
                        <Button processing={processing} onClick={handleSubmit}>
                            Register
                        </Button>
                        {/* <a href="#" className="text-sm underline text-blue-600">
                            forgot password
                        </a> */}
                    </div>
                    <div className="flex flex-row items-center space-x-2 justify-between my-3">
                        <div className="border-b-2 w-full" />
                        <div>OR</div>
                        <div className="border-b-2 w-full" />
                    </div>
                    <div className="flex flex-row w-full justify-center">
                        <div
                            className="flex flex-row items-center space-x-2 border-2 border-blue-600 px-4 py-2 hover:bg-blue-500 hover:text-white rounded"
                            onClick={handleLoginWithGoogle}
                        >
                            <FcGoogle className="h-6 w-6" />
                            <div>Register with Google</div>
                        </div>
                    </div>
                    <div className="mt-10 w-full text-center text-blue-600 underline">
                        <Link href={route('customer.login')}>
                            already have account ? login
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
