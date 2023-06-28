import React from 'react'
import { usePage, useForm } from '@inertiajs/react'
import { isEmpty } from 'lodash'

import Button from '@/Components/Button'
import FormInputNumeric from '@/Components/FormInputNumeric'

export default function Paylater() {
    const {
        props: { customer, levels },
    } = usePage()
    const { data, setData, post, processing, errors } = useForm({
        level: customer?.level.key,
        paylater_limit: +customer?.paylater?.limit,
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
        post(route('customer.update_level', customer))
    }

    if (isEmpty(customer)) {
        return
    }

    return (
        <div className="mt-2 flex flex-col p-4 border rounded border-gray-200">
            <div className="mt-4">
                {!isEmpty(customer.identity_image_url) && (
                    <div>
                        <div className="pb-4 font-bold">KTP</div>
                        <img
                            alt="identity"
                            src={customer?.identity_image_url}
                            className="w-full object-fill h-96"
                            loading="lazy"
                        />
                    </div>
                )}
                <div className="mb-1 text-sm">Level</div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={handleOnChange}
                    value={data.level}
                    name="level"
                >
                    <option value=""></option>
                    {levels.map((level) => (
                        <option value={level.key} key={level.key}>
                            {level.name}
                        </option>
                    ))}
                </select>
                {errors.level && (
                    <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                        {errors.level}
                    </p>
                )}
            </div>
            <div className="mb-4 mt-2">
                <FormInputNumeric
                    type="number"
                    label="Limit Hutang"
                    name="paylater_limit"
                    onChange={handleOnChange}
                    value={data.paylater_limit}
                    error={errors.paylater_limit}
                />
            </div>
            <div className="flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
            </div>
        </div>
    )
}
