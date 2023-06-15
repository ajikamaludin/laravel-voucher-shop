import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import CustomerLayout from '@/Layouts/CustomerLayout'
import VoucherCard from './VoucherCard'

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
        _location_id,
    } = props

    const [locId, setLocId] = useState(_location_id)
    const [v, setV] = useState(data)

    const handleSelectLoc = (loc) => {
        if (loc.id === locId) {
            setLocId('')
            fetch('')
            return
        }
        setLocId(loc.id)
        fetch(loc.id)
    }

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {
                location_id: locId,
            },
            {
                replace: true,
                preserveState: true,
                only: ['vouchers'],
                onSuccess: (res) => {
                    setV(v.concat(res.props.vouchers.data))
                },
            }
        )
    }

    const fetch = (locId) => {
        router.get(
            route(route().current()),
            { location_id: locId },
            {
                replace: true,
                preserveState: true,
                onSuccess: (res) => {
                    setV(res.props.vouchers.data)
                },
            }
        )
    }

    return (
        <CustomerLayout>
            <Head title="poin" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div className="pt-5 text-2xl px-5 font-bold">Tukar poin</div>
                <div className="px-5 text-gray-400 text-sm">
                    tukarkan poin anda dengan voucher manarik
                </div>

                {v.length <= 0 ? (
                    <EmptyHere />
                ) : (
                    <div className="w-full flex flex-col pt-5">
                        {/* chips */}
                        <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-2">
                            {locations.map((location) => (
                                <div
                                    onClick={() => handleSelectLoc(location)}
                                    key={location.id}
                                    className={`px-2 py-1 rounded-2xl ${
                                        location.id === locId
                                            ? 'text-white bg-blue-600 border border-blue-800'
                                            : 'bg-blue-100 border border-blue-200'
                                    }`}
                                >
                                    {location.name}
                                </div>
                            ))}
                        </div>

                        {/* voucher */}
                        <div className="flex flex-col w-full px-3 mt-3 space-y-2">
                            {v.map((voucher) => (
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
        </CustomerLayout>
    )
}
