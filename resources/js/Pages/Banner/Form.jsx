import React, { useEffect, Suspense } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'
import FormFile from '@/Components/FormFile'

const TinyEditor = React.lazy(() => import('@/Components/TinyMCE'))

export default function Form(props) {
    const { banner } = props

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image: '',
        image_url: '',
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
        if (isEmpty(banner) === false) {
            post(route('banner.update', banner))
            return
        }
        post(route('banner.store'))
    }

    useEffect(() => {
        if (isEmpty(banner) === false) {
            setData({
                title: banner.title,
                description: banner.description,
                image_url: banner.image_url,
            })
        }
    }, [banner])

    return (
        <AuthenticatedLayout page={'Banner'} action={'Form'}>
            <Head title="Banner" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Banner</div>
                        <FormInput
                            name="title"
                            value={data.title}
                            onChange={handleOnChange}
                            label="Title"
                            error={errors.title}
                        />
                        <FormFile
                            label={'Image'}
                            onChange={(e) =>
                                setData('image', e.target.files[0])
                            }
                            error={errors.image}
                            preview={
                                isEmpty(data.image_url) === false && (
                                    <img
                                        src={data.image_url}
                                        className="mb-1 h-24 w-full object-cover"
                                        alt="preview"
                                        loading="lazy"
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
