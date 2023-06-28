import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { HiXMark, HiOutlineStar } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import VoucherCard from './VoucherCard'
import LocationModal from '../Index/Partials/LocationModal'
import FormLocation from '@/Customer/Components/FormLocation'

import { ALL, FAVORITE } from '../Index/utils'
import { useModalState } from '@/hooks'

const EmptyHere = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Voucher segera tersedia</div>
            <div className="text-gray-400">
                Yuk, share referral kamu untuk tingkatkan poinnya
            </div>
        </div>
    )
}

export default function Exhange(props) {
    const {
        locations,
        vouchers: { data, next_page_url },
        _favorite,
        _slocations,
        _flocations,
    } = props

    const [favorite, setFavorite] = useState(_favorite)
    const [vouchers, setVouchers] = useState(data)

    const [fLocations] = useState(_flocations)
    const [sLocations, setSLocations] = useState(_slocations)
    const locationModal = useModalState()

    const handleNextPage = () => {
        let location_ids = sLocations.map((l) => l.id)

        router.get(
            next_page_url,
            { location_ids },
            {
                replace: true,
                preserveState: true,
                only: ['vouchers'],
                onSuccess: (res) => {
                    setVouchers(vouchers.concat(res.props.vouchers.data))
                },
            }
        )
    }

    const fetch = (locations) => {
        let location_ids = locations.map((l) => l.id)

        router.get(
            route(route().current()),
            { location_ids },
            {
                replace: true,
                preserveState: true,
                onSuccess: (res) => {
                    setVouchers(res.props.vouchers.data)
                },
            }
        )
    }

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

    const isStatus = (s) => {
        if (s === favorite) {
            return 'px-2 py-1 rounded-2xl hover:bg-blue-800 text-white bg-blue-600 border border-blue-800'
        }
        return 'px-2 py-1 rounded-2xl hover:bg-blue-800 hover:text-white bg-blue-100 border border-blue-200'
    }

    const handleFavorite = () => {
        setFavorite(FAVORITE)
        fetch(fLocations)
    }

    const handleAll = () => {
        setFavorite(ALL)
        fetch(sLocations)
    }

    return (
        <CustomerLayout>
            <Head title="Poin" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="pt-5 text-2xl px-5 font-bold">Tukar Poin</div>
                <div className="px-5 text-gray-400 text-sm">
                    tukarkan poin anda dengan voucher manarik
                </div>
                <div className="w-full flex flex-col pt-5">
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row space-x-2 px-4">
                            <div className={isStatus(ALL)} onClick={handleAll}>
                                Semua
                            </div>
                            <div
                                className={isStatus(FAVORITE)}
                                onClick={handleFavorite}
                            >
                                Favorit
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-full space-x-2 px-4 my-2"
                        onClick={locationModal.toggle}
                    >
                        <FormLocation placeholder="Cari Lokasi" />
                    </div>
                    {favorite === ALL ? (
                        <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-4">
                            {sLocations.map((location, index) => (
                                <div
                                    className="flex flex-row items-center gap-1 px-2 py-1 rounded-2xl bg-blue-100 border border-blue-200 hover:bg-blue-500"
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
                    ) : (
                        <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-4">
                            {fLocations.map((location, index) => (
                                <div
                                    className="flex flex-row items-center gap-1 px-2 py-1 rounded-2xl bg-blue-100 border border-blue-200 hover:bg-blue-500"
                                    key={location.id}
                                    onClick={() => handleRemoveLocation(index)}
                                >
                                    <div>{location.name}</div>
                                    <div className="pl-2">
                                        <HiOutlineStar className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {vouchers.length <= 0 ? (
                    <EmptyHere />
                ) : (
                    <div className="w-full flex flex-col">
                        {/* voucher */}
                        <div className="flex flex-col w-full px-3 mt-3 space-y-2">
                            {vouchers.map((voucher) => (
                                <VoucherCard
                                    key={voucher.id}
                                    voucher={voucher}
                                />
                            ))}
                            {next_page_url !== null && (
                                <div
                                    onClick={handleNextPage}
                                    className="w-full text-center px-2 py-1 border mt-5 hover:bg-blue-600 hover:text-white"
                                >
                                    Load more
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <LocationModal
                state={locationModal}
                locations={locations}
                onItemSelected={handleAddLocation}
            />
        </CustomerLayout>
    )
}
