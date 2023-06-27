import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm, usePage } from '@inertiajs/react'
import FormFile from '@/Components/FormFile'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'

const Profile = () => {
    const {
        props: { customer, statuses },
    } = usePage()

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        name: '',
        fullname: '',
        address: '',
        phone: '',
        image: '',
        image_url: '',
        status: 0,
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
        if (isEmpty(customer) === false) {
            post(route('customer.update', customer))
            return
        }
        post(route('customer.store'))
    }

    useEffect(() => {
        if (isEmpty(customer) === false) {
            setData({
                username: customer.username,
                password: customer.password,
                name: customer.name,
                fullname: customer.fullname,
                address: customer.address,
                phone: customer.phone,
                image_url: customer.image_url,
                status: customer.status,
            })
        }
    }, [customer])

    return (
        <div className="flex flex-col p-4 border rounded border-gray-200">
            <div className="pb-4 font-bold">Profile</div>
            <FormInput
                name="fullname"
                value={data.fullname}
                onChange={handleOnChange}
                label="Nama Lengkap"
                error={errors.fullname}
            />
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama Panggilan"
                error={errors.name}
            />
            <FormInputWith
                type="number"
                leftItem={<div className="text-sm">+62</div>}
                name="phone"
                value={data.phone}
                onChange={handleOnChange}
                error={errors.phone}
                formClassName={'pl-10'}
                label="Whatsapp"
            />
            <TextArea
                name="address"
                value={data.address}
                onChange={handleOnChange}
                label="Alamat Lengkap"
                error={errors.address}
                rows={4}
            />
            <FormInput
                name="username"
                value={data.username}
                onChange={handleOnChange}
                label="username"
                error={errors.username}
            />
            <FormInput
                name="password"
                value={data.password}
                onChange={handleOnChange}
                label="password"
                error={errors.password}
            />
            <div className="mt-2">
                <div className="mb-1 text-sm">Status</div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={handleOnChange}
                    value={data.status}
                    name="status"
                >
                    <option value=""></option>
                    {statuses.map((status, index) => (
                        <option value={index} key={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
            <FormFile
                label={'Image'}
                onChange={(e) => setData('image', e.target.files[0])}
                error={errors.image}
                preview={
                    isEmpty(data.image_url) === false && (
                        <img
                            src={data.image_url}
                            className="mb-1 h-24 w-24 object-cover rounded-full"
                            alt="preview"
                            loading="lazy"
                        />
                    )
                }
            />

            <div className="mt-1">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
            </div>
        </div>
    )
}

const Identity = () => {
    const {
        props: { customer },
    } = usePage()

    if (isEmpty(customer?.identity_image)) {
        return
    }

    return (
        <div className="mt-2 flex flex-col p-4 border rounded border-gray-200">
            <div className="pb-4 font-bold">KTP</div>
            <img
                alt="identity"
                src={customer?.identity_image_url}
                className="w-full object-fill h-96"
                loading="lazy"
            />
        </div>
    )
}

const Paylater = () => {
    const {
        props: { customer, levels },
    } = usePage()
    const { data, setData, post, processing, errors } = useForm({
        level: customer?.level.key,
        paylater_limit: +customer?.paylater?.limit,
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
        post(route('customer.update_level', customer))
    }

    if (isEmpty(customer)) {
        return
    }

    return (
        <div className="mt-2 flex flex-col p-4 border rounded border-gray-200">
            <div className="mt-4">
                <div className="mb-1 text-sm">Level</div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={handleOnChange}
                    value={data.level}
                    name="level"
                >
                    <option value=""></option>
                    {levels.map((level) => (
                        <option value={level.key} key={level.key}>
                            {level.name}
                        </option>
                    ))}
                </select>
                {errors.level && (
                    <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                        {errors.level}
                    </p>
                )}
            </div>
            <div className="mb-4 mt-2">
                <FormInput
                    type="number"
                    label="Limit Hutang"
                    name="paylater_limit"
                    onChange={handleOnChange}
                    value={data.paylater_limit}
                    error={errors.paylater_limit}
                />
            </div>
            <div className="flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
            </div>
        </div>
    )
}

export default function Form(props) {
    const { customer } = props
    return (
        <AuthenticatedLayout page={'Customer'} action={'Form'}>
            <Head title="Customer" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Customer</div>
                        <Profile />
                        {customer !== null && (
                            <>
                                <Identity />
                                <Paylater />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
