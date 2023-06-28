import React from 'react'
import { useForm } from '@inertiajs/react'

import { useModalState } from '@/hooks'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import LocationProfileSelectionInput from '../LocationProfile/SelectionInput'
import FormInput from '@/Components/FormInput'
import FormInputDate from '@/Components/FormInputDate'
import ModalConfirm from '@/Components/ModalConfirm'

export default function ModalDelete(props) {
    const { modalState } = props

    const confirmModal = useModalState()
    const { data, setData, post, processing } = useForm({
        location_profile_id: null,
        comment: '',
        import_date: null,
        rule: 0,
    })

    const rules = [
        { val: 0, key: 'Hapus Sesuai Filter' },
        { val: 1, key: 'Hapus Keseluruhan' },
    ]

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

    const handleClose = () => {
        modalState.toggle()
    }

    const onDelete = () => {
        post(route('voucher.bulk-destroy'))
        modalState.toggle()
    }

    return (
        <>
            <Modal
                isOpen={modalState.isOpen}
                toggle={handleClose}
                title={'Bulk Delete'}
            >
                <LocationProfileSelectionInput
                    label="Profile Lokasi"
                    itemSelected={data.location_profile_id}
                    onItemSelected={(id) => setData('location_profile_id', id)}
                />
                <FormInput
                    name="comment"
                    value={data.comment}
                    onChange={handleOnChange}
                    label="Comment"
                />
                <FormInputDate
                    selected={data.import_date}
                    onChange={(date) => {
                        setData('import_date', date)
                    }}
                    label="Tanggal Import"
                />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Hapus Keseluruhan
                </label>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleOnChange}
                    value={data.rule}
                    name="rule"
                >
                    {rules.map((rule) => (
                        <option value={rule.val} key={rule.val}>
                            {rule.key}
                        </option>
                    ))}
                </select>
                <div className="flex items-center">
                    <Button
                        type="danger"
                        onClick={confirmModal.toggle}
                        processing={processing}
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
        </>
    )
}
