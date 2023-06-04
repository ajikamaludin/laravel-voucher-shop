import React from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import TextArea from '@/Components/TextArea'
import FormFile from '@/Components/FormFile'
import Checkbox from '@/Components/Checkbox'
import { extractValue } from './utils'

export default function General(props) {
    const { setting, midtrans_notification_url } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        VOUCHER_STOCK_NOTIFICATION: extractValue(
            setting,
            'VOUCHER_STOCK_NOTIFICATION'
        ),
        AFFILATE_ENABLED: extractValue(setting, 'AFFILATE_ENABLED'),
        AFFILATE_COIN_AMOUNT: extractValue(setting, 'AFFILATE_COIN_AMOUNT'),
        MIDTRANS_SERVER_KEY: extractValue(setting, 'MIDTRANS_SERVER_KEY'),
        MIDTRANS_CLIENT_KEY: extractValue(setting, 'MIDTRANS_CLIENT_KEY'),
        MIDTRANS_MERCHANT_ID: extractValue(setting, 'MIDTRANS_MERCHANT_ID'),
        MIDTRANS_LOGO: extractValue(setting, 'MIDTRANS_LOGO'),
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
        post(route('setting.update'), {
            onSuccess: () => {
                setTimeout(() => router.get(route(route().current())), 3000)
            },
        })
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Setting'}
            action={''}
            parent={route(route().current())}
        >
            <Head title="Setting" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col">
                        <div className="text-xl font-bold mb-4">Setting</div>
                        <div className="p-2 border rounded-xl">
                            <div className="font-bold mb-2">Notification</div>
                            <FormInput
                                type={'number'}
                                name="VOUCHER_STOCK_NOTIFICATION"
                                value={data.VOUCHER_STOCK_NOTIFICATION}
                                onChange={handleOnChange}
                                label="Jumlah Stok"
                                error={errors.VOUCHER_STOCK_NOTIFICATION}
                            />
                        </div>

                        <div className="mt-2 p-2 border rounded-xl">
                            <div className="font-bold mb-2">Affilate</div>
                            <FormInput
                                type={'number'}
                                name="AFFILATE_COIN_AMOUNT"
                                value={data.AFFILATE_COIN_AMOUNT}
                                onChange={handleOnChange}
                                label="Jumlah Bonus Koin"
                                error={errors.AFFILATE_COIN_AMOUNT}
                            />
                            <Checkbox
                                label="Enable"
                                value={+data.AFFILATE_ENABLED === 1}
                                onChange={handleOnChange}
                                name="AFFILATE_ENABLED"
                            />
                        </div>

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
                                        src={`${data.MIDTRANS_LOGO}`}
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
