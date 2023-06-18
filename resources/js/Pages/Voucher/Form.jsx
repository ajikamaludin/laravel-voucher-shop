import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { Head, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import LocationProfileSelectionInput from '../LocationProfile/SelectionInput'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'

export default function Form(props) {
    const { voucher } = props

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        location_profile_id: null,
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
                location_profile_id: voucher.location_id,
            })
        }
    }, [voucher])

    return (
        <AuthenticatedLayout
            page={'Voucher'}
            action={'Form'}
            parent={route('voucher.location')}
        >
            <Head title="Voucher" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col min-h-[500px]">
                        <div className="text-xl font-bold mb-4">Voucher</div>
                        <LocationProfileSelectionInput
                            label="Profile Lokasi"
                            itemSelected={data.location_profile_id}
                            onItemSelected={(id) =>
                                setData('location_profile_id', id)
                            }
                            error={errors.location_profile_id}
                        />
                        <div className="mt-2" />
                        <FormInput
                            name="username"
                            value={data.username}
                            onChange={handleOnChange}
                            label="Kode"
                            error={errors.username}
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
