import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { HiXMark } from 'react-icons/hi2'

import { useModalState } from '@/hooks'
import VoucherCard from '../Partials/VoucherCard'
import FormLocation from '../../Components/FormLocation'
import LocationModal from '../Partials/LocationModal'

const EmptyLocation = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Pilih lokasi</div>
            <div className="text-gray-400">
                pilih lokasi untuk dapat menampilkan voucher yang tersedia
            </div>
        </div>
    )
}

const EmptyVoucher = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Voucher belum tersedia</div>
            <div className="text-gray-400">
                sepertinya voucher di lokasimu sedang tidak tersedia
            </div>
        </div>
    )
}

export default function AllVoucher() {
    const {
        props: {
            locations,
            vouchers: { data, next_page_url },
            _slocations,
        },
    } = usePage()

    const locationModal = useModalState()

    const nextPageUrl = next_page_url === undefined ? null : next_page_url
    const [items, setItems] = useState(data === undefined ? [] : data)
    const [sLocations, setSLocations] = useState(_slocations)

    const handleAddLocation = (location) => {
        const isExists = sLocations.find((l) => l.id === location.id)
        if (!isExists) {
            const locations = [location].concat(...sLocations)
            setSLocations(locations)
            fetch(locations)
        }
    }

    const handleRemoveLocation = (index) => {
        const locations = sLocations.filter((_, i) => i !== index)
        setSLocations(locations)
        fetch(locations)
    }

    const handleNextPage = () => {
        let location_ids = sLocations.map((l) => l.id)

        router.get(
            nextPageUrl,
            { location_ids: location_ids },
            {
                replace: true,
                preserveState: true,
                only: ['vouchers'],
                onSuccess: (res) => {
                    if (res.props.vouchers.data !== undefined) {
                        setItems(items.concat(res.props.vouchers.data))
                    }
                },
            }
        )
    }

    const fetch = (locations) => {
        let location_ids = locations.map((l) => l.id)

        router.get(
            route(route().current()),
            { location_ids: location_ids },
            {
                replace: true,
                preserveState: true,
                onSuccess: (res) => {
                    if (res.props.vouchers.data !== undefined) {
                        setItems(res.props.vouchers.data)
                        return
                    }
                    setItems([])
                },
            }
        )
    }

    return (
        <>
            <div
                className="w-full space-x-2 px-4 mt-2"
                onClick={locationModal.toggle}
            >
                <FormLocation placeholder="Cari Lokasi" />
            </div>
            <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-4 mt-2">
                {sLocations.map((location, index) => (
                    <div
                        className="flex flex-row items-center gap-1 px-2 py-1 rounded-2xl bg-blue-100 border border-blue-200"
                        key={location.id}
                        onClick={() => handleRemoveLocation(index)}
                    >
                        <div>{location.name}</div>
                        <div className="pl-2">
                            <HiXMark className="h-5 w-5 text-red-700" />
                        </div>
                    </div>
                ))}
            </div>
            {items.length <= 0 && sLocations.length <= 0 && <EmptyLocation />}

            {/* voucher */}
            <div className="flex flex-col w-full px-3 mt-3 space-y-2">
                {items.map((voucher) => (
                    <VoucherCard key={voucher.id} voucher={voucher} />
                ))}
                {nextPageUrl !== null && (
                    <div
                        onClick={handleNextPage}
                        className="w-full text-center px-2 py-1 border mt-5 hover:bg-blue-600 hover:text-white"
                    >
                        Load more
                    </div>
                )}
            </div>
            {items.length <= 0 && sLocations.length > 0 && <EmptyVoucher />}

            <LocationModal
                state={locationModal}
                locations={locations}
                onItemSelected={handleAddLocation}
            />
        </>
    )
}
