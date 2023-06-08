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
            info: '',
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
        const info = modalState.data
        if (info !== null) {
            put(route('info.update', info), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('info.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const info = modalState.data
        if (isEmpty(info) === false) {
            setData({
                info: info.title,
                is_publish: info.is_publish,
            })
            return
        }
    }, [modalState])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Info'}>
            <FormInput
                name="info"
                value={data.info}
                onChange={handleOnChange}
                label="info"
                error={errors.info}
            />
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
