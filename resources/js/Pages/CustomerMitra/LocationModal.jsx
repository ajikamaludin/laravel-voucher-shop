import React, { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import { router } from '@inertiajs/react'

import Modal from '@/Components/Modal'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'

export default function LocationModal(props) {
    const {
        modalState,
        locations: { data, links },
        onItemClick,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const handleOnItemClick = (location) => {
        onItemClick(location)
        modalState.toggle()
    }

    const params = { location_q: search }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { location_q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <Modal
            isOpen={modalState.isOpen}
            toggle={modalState.toggle}
            title={'Lokasi'}
        >
            <div className="w-full flex flex-row">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            Nama
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Deskripsi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((location) => (
                        <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200"
                            key={location.id}
                            onClick={() => handleOnItemClick(location)}
                        >
                            <td
                                scope="row"
                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {location.name}
                            </td>
                            <td className="py-4 px-6">
                                {location.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex flex-row justify-center">
                <Pagination links={links} params={params} />
            </div>
        </Modal>
    )
}
