import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormInputWith from '@/Components/FormInputWith'
import LocationSelectionInput from '../Location/SelectionInput'
import Checkbox from '@/Components/Checkbox'

export default function Form(props) {
    const { voucher, levels } = props

    const [use_level, setUseLevel] = useState(false)
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        discount: 0,
        display_price: 0,
        price_coin: 0,
        quota: '',
        profile: '',
        comment: '',
        expired: '',
        expired_unit: 'Hari',
        location_id: null,
        prices: null,
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

    const handleUseLevel = () => {
        setUseLevel(!use_level)
        if (!use_level === true) {
            const prices = levels.map((level) => {
                return {
                    name: level.name,
                    customer_level_id: level.id,
                    display_price: '0',
                }
            })
            setData('prices', prices)
            return
        }
        setData('prices', null)
    }

    const handleSetLevelPrice = (id, value) => {
        setData(
            'prices',
            data.prices.map((price) => {
                if (price.customer_level_id === id) {
                    return {
                        ...price,
                        display_price: value,
                    }
                }
                return price
            })
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
            let prices = null
            if (voucher.prices.length > 0) {
                setUseLevel(true)
                prices = voucher.prices.map((price) => {
                    return {
                        ...price,
                        name: price.level.name,
                    }
                })
            }

            setData({
                username: voucher.username,
                password: voucher.password,
                discount: voucher.discount,
                display_price: voucher.display_price,
                price_coin: voucher.price_coin,
                quota: voucher.quota,
                profile: voucher.profile,
                comment: voucher.comment,
                expired: voucher.expired,
                expired_unit: voucher.expired_unit,
                location_id: voucher.location_id,
                prices: prices,
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
                            name="price_coin"
                            value={data.price_coin}
                            onChange={handleOnChange}
                            label="Harga Coin (untuk penukaran)"
                            error={errors.price_coin}
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
                        <div className="mb-2">
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
                        <Checkbox
                            label="Level Harga"
                            value={use_level}
                            onChange={(e) => handleUseLevel(e.target.value)}
                        />
                        <div
                            className={`p-2 mt-2 border rounded ${
                                !use_level && 'invisible'
                            }`}
                        >
                            {data.prices?.map((price) => (
                                <FormInput
                                    type="number"
                                    key={price.customer_level_id}
                                    value={price.display_price}
                                    onChange={(e) =>
                                        handleSetLevelPrice(
                                            price.customer_level_id,
                                            e.target.value
                                        )
                                    }
                                    label={price.name}
                                />
                            ))}
                            {errors.prices && (
                                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.prices}
                                </p>
                            )}
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
