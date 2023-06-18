import { useEffect, useState } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import { HiArrowLeft, HiOutlineStar } from 'react-icons/hi2'

import { useAutoFocus } from '@/hooks'
import { isFavorite } from '../utils'
import FormLocation from '../../Components/FormLocation'
import Modal from '../../Components/Modal'

export default function LocationModal(props) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()
    const { state, locations, onItemSelected } = props

    const { post, processing } = useForm({})

    const [search, setSearch] = useState('')
    const locationFocus = useAutoFocus()
    const [filter_locations, setFilterLocations] = useState(locations)

    const handleOnFilter = (e) => {
        setSearch(e.target.value)
        if (e.target.value === '') {
            setFilterLocations(locations)
            return
        }
        setFilterLocations(
            filter_locations.filter((location) => {
                let name = location.name.toLowerCase()
                let search = e.target.value.toLowerCase()
                return name.includes(search)
            })
        )
    }

    const handleItemSelected = (location) => {
        onItemSelected(location)
        state.toggle()
    }

    const handleFavorite = (location) => {
        if (processing) {
            return
        }
        post(route('customer.location.favorite', location))
    }

    useEffect(() => {
        if (state.isOpen === true) {
            locationFocus.current.focus()
        }
    }, [state])

    return (
        <Modal isOpen={state.isOpen}>
            <div className="flex flex-row items-center mb-4">
                <div className="pr-2 py-2" onClick={state.toggle}>
                    <HiArrowLeft className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <FormLocation
                        placeholder="Cari Lokasi"
                        ref={locationFocus}
                        value={search}
                        onChange={handleOnFilter}
                    />
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[80vh] bg-white">
                {filter_locations.map((location) => (
                    <div
                        className="flex flex-row justify-between items-center hover:bg-gray-200"
                        key={location.id}
                    >
                        <div
                            onClick={() => handleItemSelected(location)}
                            className="flex-1 px-3 py-3"
                        >
                            {location.name}
                        </div>
                        <div
                            className={`px-3 py-2 ${
                                user === null ? 'hidden' : ''
                            }`}
                            onClick={() => handleFavorite(location)}
                        >
                            <HiOutlineStar
                                className={`w-7 h-7 ${
                                    isFavorite(user, location.id)
                                        ? 'text-yellow-300 fill-yellow-300'
                                        : 'text-gray-300'
                                }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}
