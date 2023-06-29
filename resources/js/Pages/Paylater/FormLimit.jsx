import React from 'react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import Button from '@/Components/Button'
import CustomerSelectionInput from '../Customer/SelectionInput'
import { Head, useForm } from '@inertiajs/react'
import { MUST_VERIFIED } from '@/constant'
import FormInputNumeric from '@/Components/FormInputNumeric'

export default function FormLimit(props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: null,
        limit: '',
        description: null,
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
        post(route('paylater.update.limit'))
    }

    return (
        <AuthenticatedLayout page={'Tambah Limit'} action={'Form'}>
            <Head title="Tambah Limit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">
                            Tambah Limit
                        </div>
                        <CustomerSelectionInput
                            label="Customer"
                            itemSelected={data.customer_id}
                            onItemSelected={(id) => setData('customer_id', id)}
                            placeholder="pilih customer"
                            filter={{ levels: MUST_VERIFIED }}
                        />
                        <div className="mt-2">
                            <FormInputNumeric
                                type="number"
                                name="limit"
                                value={data.limit}
                                onChange={handleOnChange}
                                label="Limit Hutang"
                                error={errors.limit}
                            />
                        </div>
                        <FormInput
                            name="description"
                            value={data.description}
                            onChange={handleOnChange}
                            label="Keterangan"
                            error={errors.description}
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
