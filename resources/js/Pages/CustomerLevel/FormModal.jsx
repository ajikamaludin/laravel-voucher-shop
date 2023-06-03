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
            description: '',
            min_amount: 0,
            max_amount: 0,
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
        const customerLevel = modalState.data
        put(route('customer-level.update', customerLevel.id), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const customerLevel = modalState.data
        if (isEmpty(customerLevel) === false) {
            setData({
                name: customerLevel.name,
                description: customerLevel.description,
                min_amount: customerLevel.min_amount,
                max_amount: customerLevel.max_amount,
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
                name="description"
                value={data.description}
                onChange={handleOnChange}
                label="Description"
                error={errors.description}
            />
            <FormInput
                type="number"
                name="min_amount"
                value={data.min_amount}
                onChange={handleOnChange}
                label="Minimal Deposit"
                error={errors.min_amount}
            />
            <FormInput
                type="number"
                name="max_amount"
                value={data.max_amount}
                onChange={handleOnChange}
                label="Maksimal Deposit"
                error={errors.max_amount}
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
