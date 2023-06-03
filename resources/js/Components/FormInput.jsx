import React from 'react'
import Input from './Input'

export default function FormInput({
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
                <Input
                    id={name}
                    className={formClassName}
                    type={type}
                    name={name}
                    onChange={onChange}
                    value={value}
                    error={error}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    onKeyDownCapture={onKeyDownCapture}
                />
            </div>
        </div>
    )
}
