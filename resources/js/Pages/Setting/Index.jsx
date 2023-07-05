import React from 'react'
import { Head, useForm } from '@inertiajs/react'

import { extractValue } from './utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Checkbox from '@/Components/Checkbox'
import FormInputNumeric from '@/Components/FormInputNumeric'
import FormInputTime from '@/Components/FormInputTime'
import Button from '@/Components/Button'
import TextArea from '@/Components/TextArea'

export default function General(props) {
    const { setting } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        OPEN_WEBSITE_NAME: extractValue(setting, 'OPEN_WEBSITE_NAME'),
        SHARE_TEXT: extractValue(setting, 'SHARE_TEXT'),
        ENABLE_CASH_DEPOSIT: extractValue(setting, 'ENABLE_CASH_DEPOSIT'),
        ADMINFEE_CASH_DEPOSIT: extractValue(setting, 'ADMINFEE_CASH_DEPOSIT'),
        TEXT_CASH_DEPOSIT: extractValue(setting, 'TEXT_CASH_DEPOSIT'),
        ENABLE_MANUAL_TRANSFER: extractValue(setting, 'ENABLE_MANUAL_TRANSFER'),
        ADMINFEE_MANUAL_TRANSFER: extractValue(
            setting,
            'ADMINFEE_MANUAL_TRANSFER'
        ),
        MAX_MANUAL_TRANSFER_TIMEOUT: extractValue(
            setting,
            'MAX_MANUAL_TRANSFER_TIMEOUT'
        ),
        MANUAL_TRANSFER_OPEN_HOUR: extractValue(
            setting,
            'MANUAL_TRANSFER_OPEN_HOUR'
        ),
        MANUAL_TRANSFER_CLOSE_HOUR: extractValue(
            setting,
            'MANUAL_TRANSFER_CLOSE_HOUR'
        ),
        MAX_POINT_EXPIRED: extractValue(setting, 'MAX_POINT_EXPIRED'),
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
        post(route('setting.update'))
    }

    return (
        <AuthenticatedLayout
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
                            <div className="font-bold mb-2">General</div>
                            <FormInput
                                name="OPEN_WEBSITE_NAME"
                                value={data.OPEN_WEBSITE_NAME}
                                onChange={handleOnChange}
                                label="Nama Website"
                                error={errors.OPEN_WEBSITE_NAME}
                            />

                            <TextArea
                                name="SHARE_TEXT"
                                value={data.SHARE_TEXT}
                                onChange={handleOnChange}
                                label="Share Text Voucher"
                                error={errors.SHARE_TEXT}
                            />
                        </div>
                        <div className="p-2 border rounded-xl mt-2">
                            <Checkbox
                                label="Aktifkan Cash / Setor Tunai"
                                value={+data.ENABLE_CASH_DEPOSIT === 1}
                                onChange={handleOnChange}
                                name="ENABLE_CASH_DEPOSIT"
                            />
                            <FormInputNumeric
                                name="ADMINFEE_CASH_DEPOSIT"
                                value={data.ADMINFEE_CASH_DEPOSIT}
                                onChange={handleOnChange}
                                label="Biaya Admin Cash / Setor Tunai"
                                error={errors.ADMINFEE_CASH_DEPOSIT}
                            />
                            <FormInput
                                name="TEXT_CASH_DEPOSIT"
                                value={data.TEXT_CASH_DEPOSIT}
                                onChange={handleOnChange}
                                label="Nama Pilihan Pembayaran Cash / Setor Tunai"
                                error={errors.TEXT_CASH_DEPOSIT}
                            />

                            <Checkbox
                                label="Aktifkan Transfer Manual"
                                value={+data.ENABLE_MANUAL_TRANSFER === 1}
                                onChange={handleOnChange}
                                name="ENABLE_MANUAL_TRANSFER"
                            />
                            <FormInputNumeric
                                name="ADMINFEE_MANUAL_TRANSFER"
                                value={data.ADMINFEE_MANUAL_TRANSFER}
                                onChange={handleOnChange}
                                label="Biaya Admin Transfer Manual"
                                error={errors.ADMINFEE_MANUAL_TRANSFER}
                            />
                            <FormInputNumeric
                                name="MAX_MANUAL_TRANSFER_TIMEOUT"
                                value={data.MAX_MANUAL_TRANSFER_TIMEOUT}
                                onChange={handleOnChange}
                                label="Waktu Maksimal Transfer ( Jam )"
                                error={errors.MAX_MANUAL_TRANSFER_TIMEOUT}
                            />
                            <div className="my-2 flex flex-row gap-2 items-center">
                                <div>
                                    <FormInputTime
                                        name="MANUAL_TRANSFER_OPEN_HOUR"
                                        value={data.MANUAL_TRANSFER_OPEN_HOUR}
                                        onChange={(h) =>
                                            setData(
                                                'MANUAL_TRANSFER_OPEN_HOUR',
                                                h
                                            )
                                        }
                                        label="Jam Buka"
                                        error={errors.MANUAL_TRANSFER_OPEN_HOUR}
                                    />
                                </div>
                                <div> - </div>
                                <div>
                                    <FormInputTime
                                        name="MANUAL_TRANSFER_CLOSE_HOUR"
                                        value={data.MANUAL_TRANSFER_CLOSE_HOUR}
                                        onChange={(h) =>
                                            setData(
                                                'MANUAL_TRANSFER_CLOSE_HOUR',
                                                h
                                            )
                                        }
                                        label="Jam Tutup"
                                        error={
                                            errors.MANUAL_TRANSFER_CLOSE_HOUR
                                        }
                                    />
                                </div>
                            </div>
                            <FormInputNumeric
                                name="MAX_POINT_EXPIRED"
                                value={data.MAX_POINT_EXPIRED}
                                onChange={handleOnChange}
                                label="Kadaluarsa Poin Tidak digunakan (Hari)"
                                error={errors.MAX_POINT_EXPIRED}
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
