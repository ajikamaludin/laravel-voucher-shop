import React, { useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'

import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiOutlineBell } from 'react-icons/hi2'
import UserBanner from './UserBanner'
import VoucherCard from './VoucherCard'

const GuestBanner = () => {
    const {
        props: { app_name },
    } = usePage()
    return (
        <div>
            {/* user */}
            <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                <div className="flex flex-col text-white">
                    <div className="font-bold">Welcome to {app_name}</div>
                </div>
                <div className="flex flex-row">
                    <HiOutlineBell className="text-white w-7 h-7" />
                    <div>
                        <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Index(props) {
    const {
        auth: { user },
        infos,
        banners,
        locations,
        vouchers: { data, next_page_url },
        _location_id,
    } = props

    const [locId, setLocId] = useState(_location_id)
    const [v, setV] = useState(data)

    const handleBanner = (banner) => {
        router.get(route('home.banner', banner))
    }

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
            <Head title="Home" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                {user !== null ? <UserBanner user={user} /> : <GuestBanner />}
                <div id="nprogress" style={{ opacity: 1 }}></div>
                {/* banner */}
                <div className="w-full">
                    <div className="flex flex-row overflow-y-scroll space-x-2 py-3 px-2">
                        {banners.map((banner) => (
                            <img
                                onClick={() => handleBanner(banner)}
                                key={banner.id}
                                loading="lazy"
                                src={banner.image_url}
                                alt={banner.title}
                                className={`rounded w-${
                                    banners.length === 1 ? 'full' : '[80%]'
                                } min-w-[340px] h-28 object-cover`}
                            />
                        ))}
                    </div>
                </div>

                {/* info */}
                <div className="w-full px-3">
                    {infos.map((info) => (
                        <div
                            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50"
                            role="alert"
                            key={info.id}
                        >
                            {info.title}
                        </div>
                    ))}
                </div>

                <div className="w-full flex flex-col">
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
                            <VoucherCard key={voucher.id} voucher={voucher} />
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
            </div>
        </CustomerLayout>
    )
}
