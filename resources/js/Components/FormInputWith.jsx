import React from 'react'
import Input from './Input'

export default function FormInputWith({
    type,
    name,
    onChange,
    value,
    label,
    className,
    error,
    autoComplete,
    autoFocus,
    placeholder,
    disabled,
    readOnly,
    onKeyDownCapture,
    leftItem,
    formClassName,
}) {
    return (
        <div className={className}>
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {leftItem}
                </div>
                <input
                    type={type}
                    className={`mb-2 bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white ${
                        error
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    } ${formClassName}`}
                    onChange={onChange}
                    name={name}
                    value={value}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    onKeyDownCapture={onKeyDownCapture}
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
