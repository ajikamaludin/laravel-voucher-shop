import React, { forwardRef } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'

const FormLocation = forwardRef(
    (
        {
            name,
            onChange,
            value,
            autoComplete,
            autoFocus,
            placeholder,
            disabled,
            readOnly,
            onKeyDownCapture,
            max,
            min,
        },
        ref
    ) => {
        return (
            <div className="relative">
                <input
                    id={name}
                    type="text"
                    className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white active:ring-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    ref={ref}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <HiOutlineSearch className="h-6 w-6" />
                </div>
            </div>
        )
    }
)

export default FormLocation
