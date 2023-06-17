import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormInputWith from '@/Components/FormInputWith'
import LocationSelectionInput from '../Location/SelectionInput'
import Checkbox from '@/Components/Checkbox'
import { DEFAULT_EXPIRED_UNIT } from '@/constant'
import { toFixed } from '@/utils'
import FormInputNumeric from '@/Components/FormInputNumeric'

export default function Form(props) {
    const { profile, levels, expireds } = props

    const [use_level, setUseLevel] = useState(false)
    const { data, setData, post, processing, errors } = useForm({
        location_id: null,
        name: '',
        quota: '',
        display_note: '',
        expired: '',
        expired_unit: DEFAULT_EXPIRED_UNIT,
        description: '',
        min_stock: 0,
        display_price: 0,
        discount: 0,
        price_poin: 0,
        bonus_poin: 0,
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
                    level: level,
                    customer_level_id: level.id,
                    display_price: 0,
                    discount: 0,
                    price_poin: 0,
                    bonus_poin: 0,
                }
            })
            setData('prices', prices)
            return
        }
        setData('prices', null)
    }

    const handleSetLevelPrice = (id, event) => {
        setData(
            'prices',
            data.prices.map((price) => {
                if (price.customer_level_id === id) {
                    price[event.target.name] = event.target.value
                }
                return price
            })
        )
    }

    const handleSubmit = () => {
        if (isEmpty(profile) === false) {
            post(route('location-profile.update', profile))
            return
        }
        post(route('location-profile.store'))
    }

    useEffect(() => {
        if (isEmpty(profile) === false) {
            if (profile.prices.length > 0) {
                setUseLevel(true)
            }
            setData({
                name: profile.name,
                quota: profile.quota,
                display_note: profile.display_note,
                description: profile.description,
                min_stock: profile.min_stock,
                display_price: profile.display_price,
                discount: profile.discount,
                price_poin: profile.price_poin,
                bonus_poin: profile.bonus_poin,
                expired: profile.expired,
                expired_unit: profile.expired_unit,
                location_id: profile.location_id,
                prices: profile.prices.map((price) => {
                    return {
                        ...price,
                        display_price: price.display_price,
                        discount: price.discount,
                        price_poin: price.price_poin,
                        bonus_poin: price.bonus_poin,
                    }
                }),
            })
        }
    }, [profile])

    return (
        <AuthenticatedLayout page={'Profile Lokasi'} action={'Form'}>
            <Head title="Profile Lokasi" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            Profile Lokasi
                        </div>
                        <LocationSelectionInput
                            label="Lokasi"
                            itemSelected={data.location_id}
                            onItemSelected={(id) => setData('location_id', id)}
                            error={errors.location_id}
                        />
                        <div className="mt-2" />
                        <FormInput
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            label="Nama"
                            error={errors.name}
                        />
                        <FormInput
                            name="display_note"
                            value={data.display_note}
                            onChange={handleOnChange}
                            label="Catatan"
                            error={errors.display_note}
                        />
                        <FormInputNumeric
                            name="display_price"
                            value={data.display_price}
                            onChange={handleOnChange}
                            label="Harga"
                            error={errors.display_price}
                            fixed={false}
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
                        />
                        <FormInputNumeric
                            name="price_poin"
                            value={data.price_poin}
                            onChange={handleOnChange}
                            label="Harga poin (untuk penukaran)"
                            error={errors.price_poin}
                        />
                        <FormInputNumeric
                            name="bonus_poin"
                            value={data.bonus_poin}
                            onChange={handleOnChange}
                            label="Bonus poin"
                            error={errors.bonus_poin}
                        />
                        <FormInput
                            name="quota"
                            value={data.quota}
                            onChange={handleOnChange}
                            label="Kuota"
                            error={errors.quota}
                        />
                        <FormInputNumeric
                            name="min_stock"
                            value={data.min_stock}
                            onChange={handleOnChange}
                            label="Minimal Stok"
                            error={errors.min_stock}
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
                                        {expireds.map((unit) => (
                                            <option value={unit} key={unit}>
                                                {unit}
                                            </option>
                                        ))}
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
                                !use_level && 'hidden'
                            }`}
                        >
                            {errors.prices && (
                                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.prices}
                                </p>
                            )}
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            Level
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Harga
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Diskon
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Harga Poin
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Bonus Poin
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.prices?.map((price) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={price.level.id}
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {price.level.name}
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-2 px-2"
                                            >
                                                <FormInputNumeric
                                                    value={price.display_price}
                                                    name="display_price"
                                                    onChange={(e) =>
                                                        handleSetLevelPrice(
                                                            price.customer_level_id,
                                                            e
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-2 px-2"
                                            >
                                                <FormInputNumeric
                                                    value={price.discount}
                                                    name="discount"
                                                    onChange={(e) =>
                                                        handleSetLevelPrice(
                                                            price.customer_level_id,
                                                            e
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-2 px-2"
                                            >
                                                <FormInputNumeric
                                                    value={price.price_poin}
                                                    name="price_poin"
                                                    onChange={(e) =>
                                                        handleSetLevelPrice(
                                                            price.customer_level_id,
                                                            e
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-2 px-2"
                                            >
                                                <FormInputNumeric
                                                    value={price.bonus_poin}
                                                    name="bonus_poin"
                                                    onChange={(e) =>
                                                        handleSetLevelPrice(
                                                            price.customer_level_id,
                                                            e
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
