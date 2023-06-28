import { isEmpty } from 'lodash'
import React, { useRef } from 'react'

export default function FormFile({
    label,
    onChange,
    error,
    preview,
    inputRef = useRef(),
}) {
    return (
        <div className="my-4">
            {label !== '' && (
                <label
                    htmlFor={label}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
            )}
            {preview && preview}
            <div className="w-full flex flex-row gap-1 items-center border rounded-md py-1 px-1">
                <div
                    className="px-2 py-1 border rounded-md text-white bg-black hover:bg-gray-600"
                    onClick={() => inputRef.current.click()}
                >
                    Choose File
                </div>
                <div className="pl-2">
                    {isEmpty(inputRef.current?.value)
                        ? 'No choosen file'
                        : inputRef.current.value}
                </div>
            </div>
            <input
                id={label}
                className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 hidden"
                type="file"
                onChange={onChange}
                ref={inputRef}
            />
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
