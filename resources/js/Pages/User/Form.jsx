import React, { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import FormInputWith from '@/Components/FormInputWith'
import Button from '@/Components/Button'
import RoleSelectionInput from '../Role/SelectionInput'

export default function Form(props) {
    const { user } = props

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: null,
        role: '',
        username: '',
        phone_wa: '',
        photo: null,
        photo_url: '',
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
        if (isEmpty(user) === false) {
            post(route('user.update', user))
            return
        }
        post(route('user.store'))
    }

    useEffect(() => {
        if (isEmpty(user) === false) {
            setData({
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                role: user.role,
                username: user.username,
                phone_wa: user.phone_wa,
                photo: null,
                photo_url: user.photo_url,
            })
        }
    }, [user])

    return (
        <AuthenticatedLayout
            page={'Admin'}
            action={'Form'}
            parent={route('user.index')}
        >
            <Head title="Admin" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col min-h-screen">
                        <div className="text-xl font-bold mb-4">Admin</div>
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
                            name="phone_wa"
                            value={data.phone_wa}
                            onChange={handleOnChange}
                            error={errors.phone_wa}
                            formClassName={'pl-10'}
                            label="Whatsapp"
                        />
                        <FormInput
                            name="email"
                            value={data.email}
                            onChange={handleOnChange}
                            label="Email"
                            error={errors.email}
                        />
                        <FormInput
                            name="username"
                            value={data.username}
                            onChange={handleOnChange}
                            label="Username"
                            error={errors.username}
                        />
                        <FormInput
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleOnChange}
                            label="Password"
                            error={errors.password}
                        />
                        {data.role !== null && (
                            <>
                                <RoleSelectionInput
                                    label="Rule"
                                    itemSelected={data.role_id}
                                    onItemSelected={(id) =>
                                        setData('role_id', id)
                                    }
                                    error={errors.role_id}
                                />
                            </>
                        )}
                        <FormFile
                            label={'Photo'}
                            onChange={(e) =>
                                setData('photo', e.target.files[0])
                            }
                            error={errors.photo}
                            preview={
                                isEmpty(data.photo_url) === false && (
                                    <img
                                        src={data.photo_url}
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
