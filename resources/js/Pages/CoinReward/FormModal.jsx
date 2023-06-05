import React, { useEffect } from 'react'
import Modal from '@/Components/Modal'
import { useForm, usePage } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import RoleSelectionInput from '../Role/SelectionInput'

import { isEmpty } from 'lodash'

export default function FormModal(props) {
    const {
        props: { levels },
    } = usePage()
    const { modalState } = props
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            amount_buy: 0,
            bonus_coin: 0,
            customer_level_id: null,
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
        const reward = modalState.data
        if (reward !== null) {
            put(route('coin-reward.update', reward), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('coin-reward.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const reward = modalState.data
        if (isEmpty(reward) === false) {
            setData({
                amount_buy: reward.amount_buy,
                bonus_coin: reward.bonus_coin,
                customer_level_id: reward.customer_level_id,
            })
            return
        }
    }, [modalState])

    return (
        <Modal
            isOpen={modalState.isOpen}
            toggle={handleClose}
            title={'Bonus Coin'}
        >
            <FormInput
                type="number"
                name="amount_buy"
                value={data.amount_buy}
                onChange={handleOnChange}
                label="Jumlah Transaksi"
                error={errors.amount_buy}
            />
            <div className="my-4">
                <div className="mb-1 text-sm">Level</div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={handleOnChange}
                    value={data.customer_level_id}
                    name="customer_level_id"
                >
                    <option value=""></option>
                    {levels.map((level) => (
                        <option value={level.id} key={level.key}>
                            {level.name}
                        </option>
                    ))}
                </select>
                {errors.customer_level_id && (
                    <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                        {errors.customer_level_id}
                    </p>
                )}
            </div>
            <FormInput
                type="number"
                name="bonus_coin"
                value={data.bonus_coin}
                onChange={handleOnChange}
                label="Bonus Coin"
                error={errors.bonus_coin}
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
