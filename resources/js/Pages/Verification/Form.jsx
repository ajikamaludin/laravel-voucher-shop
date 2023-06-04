import React, { useEffect, useState } from 'react'
import { useForm, Head, Link } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'

export default function Form(props) {
    const { customer, levels } = props
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            level: '',
            image_prove_url: '',
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
        post(route('customer-verification.update', customer))
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Verifikasi Customer'}
            action={'Form'}
        >
            <Head title="Verifikasi Customer" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            Verifikasi Customer
                        </div>
                        <table className="relative w-full overflow-x-auto border-collapse border p-2 rounded">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Customer</td>
                                    <td>:</td>
                                    <td className="hover:underline">
                                        <Link
                                            href={route(
                                                'customer.edit',
                                                customer
                                            )}
                                        >
                                            {customer.name}
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="py-2">
                            <img
                                src={customer.identity_image_url}
                                className="w-full object-fill h-96"
                            />
                        </div>

                        <div className="my-4">
                            <div className="mb-1 text-sm">Level Upgrade</div>
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
                        </div>
                        <div className="flex items-center">
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
