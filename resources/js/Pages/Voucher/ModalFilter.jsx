import React, { useState } from 'react'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'

export default function ModalFilter(props) {
    const { modalState, sort } = props

    const filters = [
        { key: 'Kode', val: 'username' },
        { key: 'Profile', val: 'location_profile_id' },
        { key: 'Kuota', val: 'quota' },
        { key: 'comment', val: 'comment' },
        { key: 'Created At', val: 'created_at' },
        { key: 'Terjual', val: 'is_sold' },
    ]
    const rules = ['asc', 'desc']

    const [sortBy, setSortBy] = useState(filters[0].val)
    const [sortRule, setSortRule] = useState(rules[0])

    const handleClose = () => {
        modalState.toggle()
    }

    const filter = () => {
        sort(sortBy, sortRule)
        modalState.toggle()
    }

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Filter'}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Filter
            </label>
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
                name="filter"
            >
                {filters.map((filter) => (
                    <option value={filter.val} key={filter.val}>
                        {filter.key}
                    </option>
                ))}
            </select>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Order
            </label>
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSortRule(e.target.value)}
                value={sortRule}
                name="sort"
            >
                {rules.map((rule) => (
                    <option value={rule} key={rule}>
                        {rule}
                    </option>
                ))}
            </select>
            <div className="flex items-center">
                <Button onClick={filter}>Filter</Button>
            </div>
        </Modal>
    )
}
