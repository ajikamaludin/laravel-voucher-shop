import React, { useEffect } from 'react'
import { usePage, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import FormInput from '@/Components/FormInput'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'
import FormFile from '@/Components/FormFile'
import Button from '@/Components/Button'

export default function Profile() {
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
