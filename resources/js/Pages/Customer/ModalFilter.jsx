import React, { useState } from 'react'
import { HiXCircle } from 'react-icons/hi2'

import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import LocationSelectionInput from '../Location/SelectionInput'
import Checkbox from '@/Components/Checkbox'
import { usePage } from '@inertiajs/react'

export default function ModalFilter(props) {
    const {
        props: { levels },
    } = usePage()
    const { state, handleFilter } = props

    const [locations, setLocations] = useState([])
    const [checkedLevels, setCheckedLevels] = useState([])

    const handleAddLocation = (location) => {
        const isExists = locations.find((l) => l.id === location.id)
        if (!isExists) {
            setLocations(locations.concat(location))
        }
    }

    const handleRemoveLocation = (location) => {
        setLocations(locations.filter((l) => l.id !== location.id))
    }

    const handleLevelChecked = (level, e) => {
        const isExists = isLevelChecked(level)
        if (!isExists && e.target.checked) {
            setCheckedLevels(checkedLevels.concat(level))
            return
        }

        setCheckedLevels(checkedLevels.filter((l) => l.id !== level.id))
    }

    const isLevelChecked = (level) => {
        const isExists = checkedLevels.find((l) => l.id === level.id)
        if (isExists) {
            return true
        }
        return false
    }

    const handleClickFilter = () => {
        handleFilter({
            location_ids: locations.map((l) => l.id),
            levels: checkedLevels.map((l) => l.id),
        })
        state.toggle()
    }

    return (
        <Modal isOpen={state.isOpen} toggle={state.toggle} title={'Filter'}>
            <div>Lokasi: </div>
            <div className="p-2 border rounded-md">
                <div className="flex flex-row w-full gap-1 flex-wrap mb-2">
                    {locations.map((location) => (
                        <div
                            className="px-2 py-1 border border-gray-300 rounded-md bg-gray-100 flex flex-row items-center gap-1"
                            key={location.id}
                        >
                            <div className="">{location.name}</div>
                            <div onClick={() => handleRemoveLocation(location)}>
                                <HiXCircle className="text-red-600 w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
                <LocationSelectionInput
                    placeholder="pilih lokasi"
                    type="item"
                    itemSelected={null}
                    onItemSelected={(item) => handleAddLocation(item)}
                />
            </div>
            <div className="mb-1 text-sm">Level : </div>
            {levels.map((level) => (
                <Checkbox
                    key={level.id}
                    label={level.name}
                    value={isLevelChecked(level)}
                    onChange={(e) => handleLevelChecked(level, e)}
                />
            ))}

            <div className="mb-2"></div>
            <Button onClick={() => handleClickFilter()}>Filter</Button>
        </Modal>
    )
}
