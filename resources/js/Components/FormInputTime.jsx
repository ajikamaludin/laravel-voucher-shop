import React, { useEffect, useState } from 'react'

export default function FormInputTime({
    value = '10:20',
    onChange,
    label = '',
    error,
}) {
    const clocks = Array.from(Array(24).keys())
    const minutes = Array.from(Array(61).keys())

    const [clock, setClock] = useState('')
    const [minute, setMinute] = useState('')

    const selectTime = (v, s) => {
        if (s === 'm') {
            setMinute(v)
            onChange(`${clock}:${v}`)
        }
        if (s === 'c') {
            setClock(v)
            onChange(`${v}:${minute}`)
        }
    }

    useEffect(() => {
        setClock(Math.abs(value.split(':')[0]))
        setMinute(Math.abs(value.split(':')[1]))
    }, [value])

    return (
        <div>
            {label !== '' && (
                <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
            )}
            <div className="flex flex-row gap-1">
                <select
                    value={clock}
                    onChange={(e) => selectTime(e.target.value, 'c')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {clocks.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <select
                    value={minute}
                    onChange={(e) => selectTime(e.target.value, 'm')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {minutes.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
