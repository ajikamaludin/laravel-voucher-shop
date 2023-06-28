''

import React, { useEffect, useRef, useState } from 'react'
import { usePage, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import { Spinner } from 'flowbite-react'
import { HiXCircle } from 'react-icons/hi2'

export default function Partner() {
    const {
        props: { customer, csrf_token },
    } = usePage()

    const [uploadIndex, setUploadIndex] = useState(null)
    const [loading, setLoading] = useState(false)
    const generalUploadRef = useRef()

    const { data, setData, post, processing, errors } = useForm({
        job: '',
        image_selfie: null,
        image_selfie_url: '',
        file_statement: null,
        file_statement_url: '',
        file_agreement: null,
        file_agreement_url: '',
        items: [],
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

    const handleSubmit = () => {
        post(route('customer.update_partner', customer))
    }

    useEffect(() => {
        if (!isEmpty(customer?.partner)) {
            let items = JSON.parse(customer.partner.additional_json)
            if (isEmpty(items)) {
                items = []
            }
            setData({
                job: customer.partner.job,
                image_selfie_url: customer.partner.image_selfie_url,
                file_statement_url: customer.partner.file_statement_url,
                file_agreement_url: customer.partner.file_agreement_url,
                items: items,
            })
        }
    }, [customer])

    if (isEmpty(customer)) {
        return
    }

    return (
        <div className="mt-2 flex flex-col p-4 border rounded border-gray-200">
            <input
                ref={generalUploadRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
            />
            <div className="font-semibold ">Data Mitra</div>
            <div className="mt-4">
                <FormInput
                    name="job"
                    value={data.job}
                    onChange={handleOnChange}
                    label="Pekerjaan"
                    error={errors.job}
                />
            </div>
            <div className="">
                <FormFile
                    label={'Image Selfie'}
                    onChange={(e) => setData('image_selfie', e.target.files[0])}
                    error={errors.image_selfie}
                    preview={
                        isEmpty(data.image_selfie_url) === false && (
                            <a href={data.image_selfie_url} target="_blank">
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
            <div className="">
                <FormFile
                    label={'Surat Pernyataan'}
                    onChange={(e) =>
                        setData('file_statement', e.target.files[0])
                    }
                    error={errors.file_statement}
                    preview={
                        isEmpty(data.file_statement_url) === false && (
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
            <div className="">
                <FormFile
                    label={'Surat Perjanjian'}
                    onChange={(e) =>
                        setData('file_agreement', e.target.files[0])
                    }
                    error={errors.file_agreement}
                    preview={
                        isEmpty(data.file_agreement_url) === false && (
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
                <div className="font-semibold p-2">Data Lainnya</div>
                {loading ? (
                    <Spinner className="w-full h-72 py-5" size="xl" />
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
                                                    changeValueItem(index, e)
                                                }
                                            />
                                        </td>
                                        <td className="px-2 py-1">
                                            <select
                                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.type}
                                                name="type"
                                                onChange={(e) =>
                                                    changeValueItem(index, e)
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
                                            {item.type === 'text' ? (
                                                <FormInput
                                                    value={item.value}
                                                    name="value"
                                                    onChange={(e) =>
                                                        changeValueItem(
                                                            index,
                                                            e
                                                        )
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
                                                        {isEmpty(item.value) ? (
                                                            'No file chosen'
                                                        ) : (
                                                            <a
                                                                href={
                                                                    item.value
                                                                }
                                                                target="_blank"
                                                                className="underline pl-2"
                                                            >
                                                                File Uploaded
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div
                                                onClick={() =>
                                                    removeItem(index)
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
                            <Button onClick={() => addItem()}>Tambah</Button>
                        </div>
                    </>
                )}
            </div>
            <div className="mt-4 flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
            </div>
        </div>
    )
}
