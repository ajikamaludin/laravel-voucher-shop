import React, { useEffect, useState, useRef } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'
import { HiXCircle } from 'react-icons/hi2'
import { Spinner } from 'flowbite-react'
import { Button as FButton } from 'flowbite-react'

import { useModalState } from '@/hooks'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormInputWith from '@/Components/FormInputWith'
import TextArea from '@/Components/TextArea'
import FormFile from '@/Components/FormFile'
import Button from '@/Components/Button'
import FormInputNumeric from '@/Components/FormInputNumeric'
import LocationModal from './LocationModal'

export default function Form(props) {
    const { customer, statuses, levels, locations, csrf_token } = props

    const locationModal = useModalState()

    const [isDisable, setDisable] = useState(false)

    const [uploadIndex, setUploadIndex] = useState(null)
    const [loading, setLoading] = useState(false)
    const generalUploadRef = useRef()

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        username: '',
        password: '',
        name: '',
        fullname: '',
        address: '',
        phone: '',
        identity_image: null,
        identity_image_url: '',
        image: null,
        image_url: '',
        status: 0,
        level: '',
        paylater_limit: '',
        day_deadline: '',
        id_number: '',
        job: '',
        image_selfie: null,
        image_selfie_url: '',
        file_statement: null,
        file_statement_url: '',
        file_agreement: null,
        file_agreement_url: '',
        items: [],
        locations: [],
    })

    const addItem = () => {
        setData(
            'items',
            data.items.concat({
                name: '',
                type: 'text',
                value: '',
            })
        )
    }

    const removeItem = (index) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        )
    }

    const changeValueItem = (index, e) => {
        setData(
            'items',
            data.items.map((item, i) => {
                if (i === index) {
                    item[e.target.name] = e.target.value
                }
                return item
            })
        )
    }

    const handleClickUpload = (index) => {
        setUploadIndex(index)
        generalUploadRef.current.click()
    }

    const handleFileUpload = (e) => {
        const body = new FormData()
        body.append('_token', csrf_token)
        body.append('image', e.target.files[0])

        setLoading(true)
        fetch(route('post.upload'), {
            method: 'post',
            body: body,
            headers: {
                'accept-content': 'application/json',
                'X-CSSRF-TOKEN': csrf_token,
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => {
                changeValueItem(uploadIndex, {
                    target: { name: 'value', value: res.url },
                })
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

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

    const handleItemClick = (location) => {
        const isExist = data.locations.find((l) => l.id === location.id)
        if (isEmpty(isExist)) {
            setData('locations', data.locations.concat(location))
        }
    }

    const removeLocation = (location) => {
        setData(
            'locations',
            data.locations.filter((l) => l.id !== location.id)
        )
    }

    const handleSubmit = () => {
        if (isEmpty(customer) === false) {
            post(route('mitra.update', customer))
            return
        }
        post(route('mitra.store'))
    }

    useEffect(() => {
        if (isEmpty(customer) === false) {
            let items = []
            if (isEmpty(customer.partner) === false) {
                if (customer.partner.additional_json !== null) {
                    items = JSON.parse(customer.partner.additional_json)
                }
            }
            setData({
                email: customer.email,
                username: customer.username,
                password: customer.password,
                name: customer.name,
                fullname: customer.fullname,
                address: customer.address,
                phone: customer.phone,
                status: customer.status,
                image_url: customer.image_url,
                identity_image_url: customer.identity_image_url,
                level: customer.level.key,
                paylater_limit: customer.paylater.limit,
                day_deadline: customer.paylater.day_deadline,
                id_number: customer?.partner?.id_number,
                job: customer?.partner?.job,
                image_selfie_url: customer?.partner?.image_selfie_url,
                file_statement_url: customer?.partner?.file_statement_url,
                file_agreement_url: customer?.partner?.file_agreement_url,
                items: items,
                locations: customer.location_favorites,
            })
            setDisable(true)
        }
    }, [customer])

    return (
        <AuthenticatedLayout
            page={'Mitra WBB'}
            action={'Form'}
            parent={route('mitra.index')}
        >
            <Head title="Mitra WBB" />
            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="flex flex-col lg:flex-row justify-between">
                            <div className="text-xl font-bold mb-4">
                                Mitra WBB
                            </div>
                            {isEmpty(customer) === false && (
                                <div className="flex flex-col lg:flex-row gap-2 justify-end">
                                    <Link
                                        href={route(
                                            'mitra.history.deposit',
                                            customer
                                        )}
                                    >
                                        <FButton
                                            size="xs"
                                            color="primary"
                                            outline
                                        >
                                            Riwayat Deposit
                                        </FButton>
                                    </Link>
                                    <Link
                                        href={route(
                                            'mitra.history.sale',
                                            customer
                                        )}
                                    >
                                        <FButton
                                            size="xs"
                                            color="primary"
                                            outline
                                        >
                                            Riwayat Pembelian
                                        </FButton>
                                    </Link>
                                    <Link href="#">
                                        <FButton
                                            size="xs"
                                            color="primary"
                                            outline
                                        >
                                            Riwayat Pembayaran Hutang
                                        </FButton>
                                    </Link>
                                    <Link
                                        href={route(
                                            'mitra.history.paylater_limit',
                                            customer
                                        )}
                                    >
                                        <FButton
                                            size="xs"
                                            color="primary"
                                            outline
                                        >
                                            Riwayat Topup Limit
                                        </FButton>
                                    </Link>
                                    <Link
                                        href={route(
                                            'mitra.history.paylater_deadline',
                                            customer
                                        )}
                                    >
                                        <FButton
                                            size="xs"
                                            color="primary"
                                            outline
                                        >
                                            Riwayat Penambahan Tenor
                                        </FButton>
                                    </Link>
                                </div>
                            )}
                        </div>
                        {isEmpty(customer) === false && (
                            <div className="flex flex-row justify-end">
                                <FButton
                                    size="xs"
                                    color="primary"
                                    onClick={() => setDisable(!isDisable)}
                                >
                                    {isDisable ? 'Edit' : 'Batal'}
                                </FButton>
                            </div>
                        )}

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
                            name="email"
                            value={data.email}
                            onChange={handleOnChange}
                            label="email"
                            error={errors.email}
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            label={'Profile Image'}
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
                                        loading="lazy"
                                    />
                                )
                            }
                        />
                        <div className="mb-1 text-sm">Level</div>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        <div className="mt-2">
                            <FormInputNumeric
                                type="number"
                                label="Limit Hutang"
                                name="paylater_limit"
                                onChange={handleOnChange}
                                value={data.paylater_limit}
                                error={errors.paylater_limit}
                            />
                        </div>
                        <div className="mt-2">
                            <FormInputNumeric
                                type="number"
                                label="Tenor (Hari)"
                                name="day_deadline"
                                onChange={handleOnChange}
                                value={data.day_deadline}
                                error={errors.day_deadline}
                            />
                        </div>
                        <input
                            ref={generalUploadRef}
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="mt-2">
                            <FormInput
                                name="job"
                                value={data.job}
                                onChange={handleOnChange}
                                label="Pekerjaan"
                                error={errors.job}
                            />
                        </div>
                        <div className="mt-2">
                            <FormInput
                                name="id_number"
                                value={data.id_number}
                                onChange={handleOnChange}
                                label="No KTP"
                                error={errors.id_number}
                            />
                        </div>
                        <div>
                            <FormFile
                                label={'KTP Image'}
                                onChange={(e) =>
                                    setData('identity_image', e.target.files[0])
                                }
                                error={errors.identity_image}
                                preview={
                                    isEmpty(data.identity_image_url) ===
                                        false && (
                                        <a
                                            href={data.identity_image_url}
                                            target="_blank"
                                        >
                                            <img
                                                src={data.identity_image_url}
                                                className="mb-1 h-40 object-fill"
                                                alt="preview"
                                                loading="lazy"
                                            />
                                        </a>
                                    )
                                }
                            />
                        </div>
                        <div>
                            <FormFile
                                label={'Image Selfie'}
                                onChange={(e) =>
                                    setData('image_selfie', e.target.files[0])
                                }
                                error={errors.image_selfie}
                                preview={
                                    isEmpty(data.image_selfie_url) ===
                                        false && (
                                        <a
                                            href={data.image_selfie_url}
                                            target="_blank"
                                        >
                                            <img
                                                src={data.image_selfie_url}
                                                className="mb-1 h-40 object-fill"
                                                alt="preview"
                                                loading="lazy"
                                            />
                                        </a>
                                    )
                                }
                            />
                        </div>
                        <div>
                            <FormFile
                                label={'Surat Pernyataan'}
                                onChange={(e) =>
                                    setData('file_statement', e.target.files[0])
                                }
                                error={errors.file_statement}
                                preview={
                                    isEmpty(data.file_statement_url) ===
                                        false && (
                                        <div className="w-full text-right">
                                            <a
                                                href={data.file_statement_url}
                                                target="_blank"
                                                className="underline text-sm "
                                            >
                                                Download Surat Pernyataan
                                            </a>
                                        </div>
                                    )
                                }
                            />
                        </div>
                        <div>
                            <FormFile
                                label={'Surat Perjanjian'}
                                onChange={(e) =>
                                    setData('file_agreement', e.target.files[0])
                                }
                                error={errors.file_agreement}
                                preview={
                                    isEmpty(data.file_agreement_url) ===
                                        false && (
                                        <div className="w-full text-right">
                                            <a
                                                href={data.file_agreement_url}
                                                target="_blank"
                                                className="underline text-sm "
                                            >
                                                Download Surat Perjanjian
                                            </a>
                                        </div>
                                    )
                                }
                            />
                        </div>
                        <div className="border rounded-md px-2">
                            <div className="font-semibold p-2">
                                Data Lainnya
                            </div>
                            {loading ? (
                                <Spinner
                                    className="w-full h-72 py-5"
                                    size="xl"
                                />
                            ) : (
                                <>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left px-2 py-1 w-2/6">
                                                    Nama
                                                </th>
                                                <th className="text-left px-2 py-1 w-1/6">
                                                    Tipe
                                                </th>
                                                <th className="text-left px-2 py-1 w-3/6">
                                                    Nilai
                                                </th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 py-1">
                                                        <FormInput
                                                            value={item.name}
                                                            name="name"
                                                            onChange={(e) =>
                                                                changeValueItem(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <select
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            value={item.type}
                                                            name="type"
                                                            onChange={(e) =>
                                                                changeValueItem(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            <option value="text">
                                                                text
                                                            </option>
                                                            <option value="file">
                                                                file
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        {item.type ===
                                                        'text' ? (
                                                            <FormInput
                                                                value={
                                                                    item.value
                                                                }
                                                                name="value"
                                                                onChange={(e) =>
                                                                    changeValueItem(
                                                                        index,
                                                                        e
                                                                    )
                                                                }
                                                                readOnly={
                                                                    isDisable
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="w-full flex flex-row gap-1 items-center">
                                                                <div
                                                                    className="px-2 py-1 border rounded-md hover:bg-gray-200"
                                                                    onClick={() =>
                                                                        handleClickUpload(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    Choose File
                                                                </div>
                                                                <div>
                                                                    {isEmpty(
                                                                        item.value
                                                                    ) ? (
                                                                        'No file chosen'
                                                                    ) : (
                                                                        <a
                                                                            href={
                                                                                item.value
                                                                            }
                                                                            target="_blank"
                                                                            className="underline pl-2"
                                                                        >
                                                                            File
                                                                            Uploaded
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div
                                                            onClick={() =>
                                                                removeItem(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <HiXCircle className="text-red-700 w-10 h-7" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="w-full flex flex-row justify-end">
                                        {!isDisable && (
                                            <Button onClick={() => addItem()}>
                                                Tambah
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="border rounded-md px-2 mt-4">
                            <div className="flex flex-col w-full gap-2 p-2">
                                <div className="font-semibold">
                                    Lokasi Favorit
                                </div>
                                <div>
                                    {!isDisable && (
                                        <Button
                                            onClick={() =>
                                                locationModal.toggle()
                                            }
                                        >
                                            Tambah
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="w-full px-2 mb-2">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-2 py-1">
                                                Nama
                                            </th>
                                            <th className="text-left px-2 py-1">
                                                Deskripsi
                                            </th>
                                            <th className="px-2 py-1 justify-end" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.locations.map((location) => (
                                            <tr key={location.id}>
                                                <td className="px-2 py-1">
                                                    {location.name}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {location.description}
                                                </td>
                                                <td className="px-2 py-1">
                                                    <div
                                                        onClick={() =>
                                                            removeLocation(
                                                                location
                                                            )
                                                        }
                                                    >
                                                        <HiXCircle className="text-red-700 w-10 h-7" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-8">
                            {!isDisable && (
                                <Button
                                    onClick={handleSubmit}
                                    processing={processing}
                                >
                                    Simpan
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <LocationModal
                locations={locations}
                modalState={locationModal}
                onItemClick={handleItemClick}
            />
        </AuthenticatedLayout>
    )
}
