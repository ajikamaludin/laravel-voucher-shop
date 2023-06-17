import React from 'react'
import { NumericFormat } from 'react-number-format'
import Input from './Input'
import { toFixed } from '@/utils'

export default function FormInputNumeric({
    name,
    onChange,
    value,
    label,
    className,
    error,
    max = 999999999,
    fixed = true,
}) {
    if (fixed) {
        value = toFixed(value)
    }
    value = Number(value)

    return (
        <div>
            <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <NumericFormat
                max={max}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                allowLeadingZeros={false}
                className={`${className} ${
                    error &&
                    'focus:ring-red-600 border-red-600 focus:border-red-600'
                }`}
                customInput={Input}
                value={value}
                name={name}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: name,
                            value: values.floatValue,
                        },
                    })
                }}
            />
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
