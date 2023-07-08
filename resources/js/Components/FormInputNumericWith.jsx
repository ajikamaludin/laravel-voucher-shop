import React from 'react'
import { NumericFormat } from 'react-number-format'
import Input from './Input'
import { toFixed } from '@/utils'
import { isEmpty } from 'lodash'

const InputNum = (props) => {
    return <Input {...props} textSize="text-xl" inputMode="decimal" />
}

export default function FormInputNumericWith({
    name,
    onChange,
    value,
    label,
    className,
    error,
    max = 999999999,
    fixed = true,
    leftItem = null,
}) {
    if (fixed) {
        value = toFixed(value)
    }
    value = Number(value)

    const labelId = `${name}-${value}`

    return (
        <div>
            <label
                htmlFor={labelId}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <div className="relative">
                {isEmpty(leftItem) === false && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {leftItem}
                    </div>
                )}
                <NumericFormat
                    id={labelId}
                    max={max}
                    pattern="\d*"
                    inputMode="decimal"
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    className={`${className} ${
                        error &&
                        'focus:ring-red-600 border-red-600 focus:border-red-600'
                    }`}
                    customInput={InputNum}
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
            </div>
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
