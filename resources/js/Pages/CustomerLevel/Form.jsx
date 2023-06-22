import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormFile from '@/Components/FormFile'

const TinyEditor = React.lazy(() => import('@/Components/TinyMCE'))

export default function Form(props) {
    const { customer_level } = props

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        min_amount: 0,
        max_amount: 0,
        logo: null,
        logo_url: '',
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
        post(route('customer-level.update', customer_level.id))
    }

    useEffect(() => {
        if (isEmpty(customer_level) === false) {
            setData({
                name: customer_level.name,
                description: customer_level.description,
                min_amount: customer_level.min_amount,
                max_amount: customer_level.max_amount,
                logo_url: customer_level.logo_url,
            })
        }
    }, [customer_level])

    return (
        <AuthenticatedLayout
            page={'Atur Level'}
            action={'Form'}
            parent={route('customer-level.index')}
        >
            <Head title="Atur Level" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Atur Level</div>
                        <FormInput
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            label="Nama"
                            error={errors.name}
                        />
                        <FormFile
                            label={'Logo'}
                            onChange={(e) => setData('logo', e.target.files[0])}
                            error={errors.logo}
                            preview={
                                isEmpty(data.logo_url) === false && (
                                    <img
                                        src={data.logo_url}
                                        className="mb-1 h-24 object-cover"
                                        alt="preview"
                                    />
                                )
                            }
                        />
                        <div className="py-4">
                            <Suspense fallback={<div>Loading...</div>}>
                                <TinyEditor
                                    value={data.description}
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
                                            'description',
                                            editor.getContent()
                                        )
                                    }}
                                />
                            </Suspense>
                        </div>

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
