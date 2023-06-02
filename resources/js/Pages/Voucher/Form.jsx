import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormInputWith from '@/Components/FormInputWith'
import LocationSelectionInput from '../Location/SelectionInput'

export default function Form(props) {
    const { voucher } = props

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        discount: 0,
        display_price: 0,
        quota: '',
        profile: '',
        comment: '',
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
        if (isEmpty(voucher) === false) {
            post(route('voucher.update', voucher))
            return
        }
        post(route('voucher.store'))
    }

    useEffect(() => {
        if (isEmpty(voucher) === false) {
            setData({
                username: voucher.username,
                password: voucher.password,
                discount: voucher.discount,
                display_price: voucher.display_price,
                quota: voucher.quota,
                profile: voucher.profile,
                comment: voucher.comment,
                expired: voucher.expired,
                expired_unit: voucher.expired_unit,
                location_id: voucher.location_id,
            })
        }
    }, [voucher])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Voucher'}
            action={'Form'}
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
                            name="username"
                            value={data.username}
                            onChange={handleOnChange}
                            label="Username"
                            error={errors.username}
                        />
                        <FormInput
                            name="password"
                            value={data.password}
                            onChange={handleOnChange}
                            label="Password"
                            error={errors.password}
                        />
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
                        <FormInput
                            type="number"
                            name="quota"
                            value={data.quota}
                            onChange={handleOnChange}
                            label="Kuota (bytes)"
                            error={errors.quota}
                        />
                        <FormInput
                            name="profile"
                            value={data.profile}
                            onChange={handleOnChange}
                            label="Profile"
                            error={errors.profile}
                        />
                        <FormInput
                            name="comment"
                            value={data.comment}
                            onChange={handleOnChange}
                            label="Comment"
                            error={errors.comment}
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
