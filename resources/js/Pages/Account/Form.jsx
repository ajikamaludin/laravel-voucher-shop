import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import FormFile from '@/Components/FormFile'
import FormInputNumeric from '@/Components/FormInputNumeric'
import Button from '@/Components/Button'
import { Head, useForm } from '@inertiajs/react'

export default function Form(props) {
    const { account } = props

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        bank_name: '',
        holder_name: '',
        account_number: '',
        admin_fee: 0,
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
        if (isEmpty(account) === false) {
            post(route('account.update', account))
            return
        }
        post(route('account.store'))
    }

    useEffect(() => {
        if (isEmpty(account) === false) {
            setData({
                name: account.name,
                bank_name: account.bank_name,
                holder_name: account.holder_name,
                account_number: account.account_number,
                admin_fee: account.admin_fee,
                logo_url: account.logo_url,
            })
        }
    }, [account])

    return (
        <AuthenticatedLayout
            page={'Bank Akun'}
            action={'Form'}
            parent={route('account.index')}
        >
            <Head title="Bank Akun" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col ">
                        <div className="text-xl font-bold mb-4">Bank Akun</div>
                        <FormInput
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            label="Nama"
                            error={errors.name}
                        />
                        <FormInput
                            name="bank_name"
                            value={data.bank_name}
                            onChange={handleOnChange}
                            label="Nama Bank"
                            error={errors.bank_name}
                        />
                        <FormInput
                            name="holder_name"
                            value={data.holder_name}
                            onChange={handleOnChange}
                            label="Atas Nama Rekening"
                            error={errors.holder_name}
                        />
                        <FormInput
                            name="account_number"
                            value={data.account_number}
                            onChange={handleOnChange}
                            label="Nomor Rekening"
                            error={errors.account_number}
                        />
                        <FormInputNumeric
                            name="admin_fee"
                            value={data.admin_fee}
                            onChange={handleOnChange}
                            label="Admin Fee"
                            error={errors.admin_fee}
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
