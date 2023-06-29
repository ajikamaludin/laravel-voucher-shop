import React from 'react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import Button from '@/Components/Button'
import CustomerSelectionInput from '../Customer/SelectionInput'
import { Head, useForm } from '@inertiajs/react'
import { MUST_VERIFIED } from '@/constant'

export default function FormTenor(props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: null,
        day_deadline: '',
        file_agreement: null,
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
        post(route('paylater.update.tenor'))
    }

    return (
        <AuthenticatedLayout page={'Tambah Tenor'} action={'Form'}>
            <Head title="Tambah Tenor" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            Tambah Tenor
                        </div>
                        <CustomerSelectionInput
                            label="Customer"
                            itemSelected={data.customer_id}
                            onItemSelected={(id) => setData('customer_id', id)}
                            placeholder="pilih customer"
                            filter={{ levels: MUST_VERIFIED }}
                        />
                        <div className="mt-2">
                            <FormInput
                                type="number"
                                name="day_deadline"
                                value={data.day_deadline}
                                onChange={handleOnChange}
                                label="Tenor (hari)"
                                error={errors.day_deadline}
                            />
                        </div>
                        <FormFile
                            label={'Surat Perjanjian'}
                            onChange={(e) =>
                                setData('file_agreement', e.target.files[0])
                            }
                            error={errors.file_agreement}
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
