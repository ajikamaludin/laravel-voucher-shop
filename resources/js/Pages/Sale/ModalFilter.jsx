import React, { useState } from 'react'
import { HiXCircle } from 'react-icons/hi2'

import {
    PAYED_WITH_DEPOSIT,
    PAYED_WITH_MANUAL,
    PAYED_WITH_PAYLATER,
} from '@/constant'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import LocationSelectionInput from '../Location/SelectionInput'
import FormInputDateRanger from '@/Components/FormInputDateRange'

export default function ModalFilter(props) {
    const { state, handleFilter } = props

    const [locations, setLocations] = useState([])
    const [dates, setDates] = useState({
        startDate: null,
        endDate: null,
    })
    const [payment, setPayment] = useState('')

    const handleAddLocation = (location) => {
        const isExists = locations.find((l) => l.id === location.id)
        if (!isExists) {
            setLocations(locations.concat(location))
        }
    }

    const handleRemoveLocation = (location) => {
        setLocations(locations.filter((l) => l.id !== location.id))
    }

    const handleClickFilter = () => {
        handleFilter({
            location_ids: locations.map((l) => l.id),
            payment,
            ...dates,
        })
        state.toggle()
    }

    return (
        <Modal isOpen={state.isOpen} toggle={state.toggle} title={'Filter'}>
            {/* TODO: buat modal dengan filter, lokasi multiple, range tanggal, type pembayaran */}
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
            <div>
                <FormInputDateRanger
                    label="Tanggal: "
                    selected={dates}
                    onChange={(dates) => setDates(dates)}
                />
            </div>
            <div className="mb-1 text-sm">Pembayaran : </div>
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setPayment(e.target.value)}
                value={payment}
            >
                <option value=""> -- filter pembayaran -- </option>
                <option value={PAYED_WITH_DEPOSIT}>Deposit</option>
                <option value={PAYED_WITH_PAYLATER}>Hutang</option>
            </select>

            <Button onClick={() => handleClickFilter()}>Filter</Button>
        </Modal>
    )
}
