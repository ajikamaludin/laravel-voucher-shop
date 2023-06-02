import React, { useEffect } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import RoleSelectionInput from '../Role/SelectionInput'

import { isEmpty } from 'lodash'

export default function FormModal(props) {
    const { modalState } = props
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            bank_name: '',
            holder_name: '',
            account_number: '',
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

    const handleReset = () => {
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const account = modalState.data
        if (account !== null) {
            put(route('account.update', account), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('account.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const account = modalState.data
        if (isEmpty(account) === false) {
            setData({
                name: account.name,
                bank_name: account.bank_name,
                holder_name: account.holder_name,
                account_number: account.account_number,
            })
            return
        }
    }, [modalState])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Info'}>
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
            <div className="flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
                <Button onClick={handleClose} type="secondary">
                    Batal
                </Button>
            </div>
        </Modal>
    )
}
