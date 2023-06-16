import React from 'react'
import { isEmpty } from 'lodash'
import { HiFilter } from 'react-icons/hi'

export default function FormLocation({
    type,
    name,
    onChange,
    value,
    label,
    autoComplete,
    autoFocus,
    placeholder,
    disabled,
    readOnly,
    onKeyDownCapture,
    max,
    min,
}) {
    return (
        <>
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type="text"
                    className="mb-2 bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white active:ring-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={onChange}
                    name={name}
                    value={value}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    onKeyDownCapture={onKeyDownCapture}
                    max={max}
                    min={min}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <HiFilter />
                </div>
            </div>
        </>
    )
}
