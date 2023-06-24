import React, { Suspense } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Checkbox from '@/Components/Checkbox'
import FormInputNumeric from '@/Components/FormInputNumeric'
import FormInputTime from '@/Components/FormInputTime'
import Button from '@/Components/Button'
import { extractValue } from './utils'

const TinyEditor = React.lazy(() => import('@/Components/TinyMCE'))

export default function General(props) {
    const { setting } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        OPEN_WEBSITE_NAME: extractValue(setting, 'OPEN_WEBSITE_NAME'),
        SHARE_TEXT: extractValue(setting, 'SHARE_TEXT'),
        ENABLE_CASH_DEPOSIT: extractValue(setting, 'ENABLE_CASH_DEPOSIT'),
        ENABLE_MANUAL_TRANSFER: extractValue(setting, 'ENABLE_MANUAL_TRANSFER'),
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

                            <div className="py-4">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Share Text Voucher
                                </label>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <TinyEditor
                                        value={data.SHARE_TEXT}
                                        init={{
                                            height: 500,
                                            // menubar: false,
                                            menubar:
                                                'file edit view insert format tools table help',
                                            plugins:
                                                'preview importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons',
                                            toolbar_mode: 'scrolling',
                                            toolbar:
                                                'undo redo | insertfile image media link | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save print | ltr rtl | anchor codesample',
                                        }}
                                        onEditorChange={(newValue, editor) => {
                                            setData(
                                                'SHARE_TEXT',
                                                editor.getContent()
                                            )
                                        }}
                                    />
                                </Suspense>
                            </div>
                        </div>
                        <div className="p-2 border rounded-xl mt-2">
                            <Checkbox
                                label="Aktifkan Setor Tunai"
                                value={+data.ENABLE_CASH_DEPOSIT === 1}
                                onChange={handleOnChange}
                                name="ENABLE_CASH_DEPOSIT"
                            />
                            <Checkbox
                                label="Aktifkan Transfer Manual"
                                value={+data.ENABLE_MANUAL_TRANSFER === 1}
                                onChange={handleOnChange}
                                name="ENABLE_MANUAL_TRANSFER"
                            />
                            <FormInputNumeric
                                name="MAX_MANUAL_TRANSFER_TIMEOUT"
                                value={data.MAX_MANUAL_TRANSFER_TIMEOUT}
                                onChange={handleOnChange}
                                label="Waktu Maksimal Transfer (Jam)"
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
