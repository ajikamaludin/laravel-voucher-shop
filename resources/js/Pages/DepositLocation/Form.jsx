import React, { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import FormInputWith from '@/Components/FormInputWith'
import Button from '@/Components/Button'
import RoleSelectionInput from '../Role/SelectionInput'
import FormInputTime from '@/Components/FormInputTime'

export default function Form(props) {
    const { location } = props

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        phone: '',
        gmap_url: '',
        image: null,
        image_url: '',
        open_hour: '00:00',
        close_hour: '00:00',
        is_active: 0,
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
        if (isEmpty(location) === false) {
            post(route('deposit-location.update', location))
            return
        }
        post(route('deposit-location.store'))
    }

    useEffect(() => {
        if (isEmpty(location) === false) {
            setData({
                name: location.name,
                address: location.address,
                phone: location.phone,
                gmap_url: location.gmap_url,
                image_url: location.image_url,
                open_hour: location.open_hour,
                close_hour: location.close_hour,
                is_active: location.is_active,
            })
        }
    }, [location])

    return (
        <AuthenticatedLayout
            page={'Lokasi Deposit'}
            action={'Form'}
            parent={route('deposit-location.index')}
        >
            <Head title="Lokasi Deposit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col">
                        <div className="text-xl font-bold mb-4">
                            Lokasi Deposit
                        </div>
                        <FormInput
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            label="Nama"
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
                        <FormInput
                            name="address"
                            value={data.address}
                            onChange={handleOnChange}
                            label="Alamat"
                            error={errors.address}
                        />
                        <FormInput
                            name="gmap_url"
                            value={data.gmap_url}
                            onChange={handleOnChange}
                            label="Google Map URL"
                            error={errors.gmap_url}
                        />
                        <div className="mt-2 flex flex-row gap-2 items-center">
                            <div>
                                <FormInputTime
                                    name="open_hour"
                                    value={data.open_hour}
                                    onChange={(h) => setData('open_hour', h)}
                                    label="Jam Buka"
                                    error={errors.open_hour}
                                />
                            </div>
                            <div> - </div>
                            <div>
                                <FormInputTime
                                    name="close_hour"
                                    value={data.close_hour}
                                    onChange={(h) => setData('close_hour', h)}
                                    label="Jam Tutup"
                                    error={errors.close_hour}
                                />
                            </div>
                        </div>
                        <div className="my-4">
                            <div className="mb-1 text-sm">Aktif </div>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleOnChange}
                                value={+data.is_active}
                                name="is_active"
                            >
                                <option value={0}>No</option>
                                <option value={1}>Yes</option>
                            </select>
                        </div>
                        <FormFile
                            label={'Photo Lokasi'}
                            onChange={(e) =>
                                setData('image', e.target.files[0])
                            }
                            error={errors.image}
                            preview={
                                isEmpty(data.image_url) === false && (
                                    <img
                                        src={data.image_url}
                                        className="mb-1 h-24 object-cover "
                                        alt="preview"
                                        loading="lazy"
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
