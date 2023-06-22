import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'

const TinyEditor = React.lazy(() => import('@/Components/TinyMCE'))

export default function Form(props) {
    const { info } = props

    const { data, setData, post, put, processing, errors } = useForm({
        title: '',
        description: '',
        is_publish: 1,
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
        if (isEmpty(info) === false) {
            put(route('info.update', info))
            return
        }
        post(route('info.store'))
    }

    useEffect(() => {
        if (isEmpty(info) === false) {
            setData({
                title: info.title,
                description: info.description,
                is_publish: info.is_publish,
            })
        }
    }, [info])

    return (
        <AuthenticatedLayout
            page={'Info'}
            action={'Form'}
            parent={route('info.index')}
        >
            <Head title="Info" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Info</div>
                        <FormInput
                            name="title"
                            value={data.title}
                            onChange={handleOnChange}
                            label="Title"
                            error={errors.title}
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
                        <div className="my-4">
                            <div className="mb-1 text-sm">Publish </div>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleOnChange}
                                value={+data.is_publish}
                                name="is_publish"
                            >
                                <option value={0}>No</option>
                                <option value={1}>Yes</option>
                            </select>
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
