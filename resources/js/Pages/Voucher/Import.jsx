import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormInputWith from '@/Components/FormInputWith'
import LocationSelectionInput from '../Location/SelectionInput'
import TextArea from '@/Components/TextArea'

export default function Import(props) {
    const { data, setData, post, processing, errors } = useForm({
        script: '',
        discount: 0,
        display_price: 0,
        expired: '',
        expired_unit: 'Hari',
        location_id: null,
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
        post(route('voucher.import'))
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Voucher'}
            action={'Import'}
        >
            <Head title="Voucher" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Voucher</div>
                        <LocationSelectionInput
                            label="Lokasi"
                            itemSelected={data.location_id}
                            onItemSelected={(id) => setData('location_id', id)}
                            error={errors.location_id}
                        />
                        <div className="mt-2" />
                        <FormInput
                            type="number"
                            name="display_price"
                            value={data.display_price}
                            onChange={handleOnChange}
                            label="Harga"
                            error={errors.display_price}
                        />
                        <FormInputWith
                            type="number"
                            rightItem={<div className="text-sm">%</div>}
                            name="discount"
                            value={data.discount}
                            onChange={handleOnChange}
                            error={errors.discount}
                            formClassName={'pr-10'}
                            label="Discount"
                            max={100}
                            min={0}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Masa Aktif
                            </label>
                            <div className="w-full flex flex-row space-x-2 items-center">
                                <FormInput
                                    type="number"
                                    name="expired"
                                    value={data.expired}
                                    onChange={handleOnChange}
                                    // label="Masa Aktif"
                                    error={errors.expired}
                                    className="flex-1"
                                />
                                <div>
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        onChange={handleOnChange}
                                        value={data.expired_unit}
                                        name="expired_unit"
                                    >
                                        <option value="Jam">Jam</option>
                                        <option value="Hari">Hari</option>
                                        <option value="Minggu">Minggu</option>
                                        <option value="Bulan">Bulan</option>
                                        <option value="Tahun">Tahun</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <TextArea
                            name="script"
                            value={data.script}
                            onChange={handleOnChange}
                            label="Script"
                            error={errors.script}
                            rows={16}
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
