import React, { Suspense } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { extractValue } from './utils'

const TinyEditor = React.lazy(() => import('@/Components/TinyMCE'))

export default function General(props) {
    const { setting } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        OPEN_WEBSITE_NAME: extractValue(setting, 'OPEN_WEBSITE_NAME'),
        SHARE_TEXT: extractValue(setting, 'SHARE_TEXT'),
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
