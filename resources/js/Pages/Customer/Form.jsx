import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormFile from '@/Components/FormFile'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'

export default function Form(props) {
    const { customer } = props

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        name: '',
        fullname: '',
        address: '',
        phone: '',
        image: '',
        image_url: '',
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
                image: customer.image,
                image_url: customer.image_url,
            })
        }
    }, [customer])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Customer'}
            action={'Form'}
        >
            <Head title="Customer" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Customer</div>
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
                        <FormFile
                            label={'Image'}
                            onChange={(e) =>
                                setData('image', e.target.files[0])
                            }
                            error={errors.image}
                            preview={
                                isEmpty(data.image_url) === false && (
                                    <img
                                        src={data.image_url}
                                        className="mb-1 h-24 w-24 object-cover rounded-full"
                                        alt="preview"
                                    />
                                )
                            }
                        />

                        <div className="mt-8">
                            <Button
                                onClick={handleSubmit}
                                processing={processing}
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
