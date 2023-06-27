import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { converToDate, dateToString } from '@/utils'

const CustomDateRange = forwardRef(({ value, onClick }, ref) => {
    return (
        <div
            className="px-3 py-2 rounded-md w-full border border-gray-200"
            ref={ref}
            onClick={onClick}
        >
            {value}
        </div>
    )
})

export default function InputDateRanger({ selected, onChange }) {
    return (
        <div>
            <DatePicker
                selected={converToDate(selected.startDate)}
                onChange={(date) => {
                    let startDate = dateToString(date[0])
                    let endDate = null
                    if (date[1] != null) {
                        endDate = dateToString(date[1])
                    }
                    onChange({ startDate, endDate })
                }}
                startDate={converToDate(selected.startDate)}
                endDate={converToDate(selected.endDate)}
                closeOnScroll={true}
                shouldCloseOnSelect={true}
                dateFormat="dd/MM/yyyy"
                className={`mb-2 bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                nextYearButtonLabel=">"
                previousYearButtonLabel="<"
                customInput={<CustomDateRange />}
                selectsRange
            />
        </div>
    )
}
