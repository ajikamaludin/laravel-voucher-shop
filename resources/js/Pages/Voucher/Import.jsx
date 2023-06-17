import React, { useState } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormInputWith from '@/Components/FormInputWith'
import LocationProfileSelectionInput from '../LocationProfile/SelectionInput'
import TextArea from '@/Components/TextArea'
import Checkbox from '@/Components/Checkbox'

export default function Import(props) {
    const { data, setData, post, processing, errors } = useForm({
        script: '',
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
        post(route('voucher.import'))
    }

    return (
        <AuthenticatedLayout page={'Voucher'} action={'Import'}>
            <Head title="Voucher" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
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
