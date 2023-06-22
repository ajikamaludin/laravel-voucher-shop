import React from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import TextArea from '@/Components/TextArea'
import FormFile from '@/Components/FormFile'
import Checkbox from '@/Components/Checkbox'
import { extractValue } from './utils'
import FormInputNumeric from '@/Components/FormInputNumeric'

export default function General(props) {
    const { setting, midtrans_notification_url } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        MIDTRANS_SERVER_KEY: extractValue(setting, 'MIDTRANS_SERVER_KEY'),
        MIDTRANS_CLIENT_KEY: extractValue(setting, 'MIDTRANS_CLIENT_KEY'),
        MIDTRANS_MERCHANT_ID: extractValue(setting, 'MIDTRANS_MERCHANT_ID'),
        MIDTRANS_ADMIN_FEE: extractValue(setting, 'MIDTRANS_ADMIN_FEE'),
        MIDTRANS_LOGO_URL: extractValue(setting, 'MIDTRANS_LOGO'),
        MIDTRANS_ENABLED: extractValue(setting, 'MIDTRANS_ENABLED'),
        midtrans_logo_file: null,
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
        post(route('setting.payment'))
    }

    return (
        <AuthenticatedLayout
            page={'Payment Gateway'}
            action={''}
            parent={route(route().current())}
        >
            <Head title="Payment Gateway" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col">
                        <div className="mt-2 p-2 border rounded-xl">
                            <div className="font-bold mb-2">
                                Midtrans Payment
                            </div>
                            <FormInput
                                name="MIDTRANS_MERCHANT_ID"
                                value={data.MIDTRANS_MERCHANT_ID}
                                onChange={handleOnChange}
                                label="Merchant ID"
                                error={errors.MIDTRANS_MERCHANT_ID}
                            />
                            <FormInput
                                name="MIDTRANS_SERVER_KEY"
                                value={data.MIDTRANS_SERVER_KEY}
                                onChange={handleOnChange}
                                label="Server Key"
                                error={errors.MIDTRANS_SERVER_KEY}
                            />
                            <FormInput
                                name="MIDTRANS_CLIENT_KEY"
                                value={data.MIDTRANS_CLIENT_KEY}
                                onChange={handleOnChange}
                                label="Client Key"
                                error={errors.MIDTRANS_CLIENT_KEY}
                            />
                            <FormInputNumeric
                                name="MIDTRANS_ADMIN_FEE"
                                value={data.MIDTRANS_ADMIN_FEE}
                                onChange={handleOnChange}
                                label="ADMIN FEE"
                                error={errors.MIDTRANS_ADMIN_FEE}
                            />
                            <FormFile
                                label={'Logo'}
                                onChange={(e) =>
                                    setData(
                                        'midtrans_logo_file',
                                        e.target.files[0]
                                    )
                                }
                                error={errors.midtrans_logo_file}
                                preview={
                                    <img
                                        src={`${data.MIDTRANS_LOGO_URL}`}
                                        className="w-40 mb-1"
                                        alt="site logo"
                                    />
                                }
                            />
                            <FormInput
                                value={midtrans_notification_url}
                                label="Notification URL"
                                readOnly={true}
                            />
                            <Checkbox
                                label="Enable"
                                value={+data.MIDTRANS_ENABLED === 1}
                                onChange={handleOnChange}
                                name="MIDTRANS_ENABLED"
                            />
                        </div>

                        <div className="mt-4">
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
