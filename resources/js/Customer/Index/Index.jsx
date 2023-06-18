import Reactm, { useState, useEffect } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { HiOutlineBell } from 'react-icons/hi2'

import { handleBanner, ALL, FAVORITE } from './utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import UserBanner from './Partials/UserBanner'
import AllVoucher from './IndexPartials/AllVoucher'
import FavoriteVoucher from './IndexPartials/FavoriteVoucher'

const GuestBanner = () => {
    const {
        props: { setting, notification_count },
    } = usePage()
    return (
        <div>
            {/* user */}
            <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                <div className="flex flex-col text-white">
                    <div className="font-bold">{setting.OPEN_WEBSITE_NAME}</div>
                </div>
                <div className="flex flex-row">
                    <HiOutlineBell className="text-white w-7 h-7" />
                    <div>
                        <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                            {notification_count}
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
        _status,
    } = props

    const [bannerIndex, setBannerIndex] = useState(0)

    const isStatus = (s) => {
        if (s === _status) {
            return 'px-2 py-1 rounded-2xl hover:bg-blue-800 text-white bg-blue-600 border border-blue-800'
        }
        return 'px-2 py-1 rounded-2xl hover:bg-blue-800 hover:text-white bg-blue-100 border border-blue-200'
    }

    const handleFavorite = () => {
        if (user === null) {
            router.visit(route('customer.login'))
        }
        router.visit(route('home.favorite'))
    }

    const handleAll = () => {
        router.visit(route('home.index'))
    }

    useEffect(() => {
        let tm = setTimeout(
            () =>
                setBannerIndex((prevIndex) =>
                    prevIndex === banners.length - 1 ? 0 : prevIndex + 1
                ),
            3000
        )

        return () => clearTimeout(tm)
    }, [bannerIndex])

    return (
        <CustomerLayout>
            {/* for test */}
            {/* <div id="nprogress"></div> */}

            <Head title="Home" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                {/* guest or user banner */}
                {user !== null ? <UserBanner user={user} /> : <GuestBanner />}
                {/* banner */}
                <div className="w-full">
                    <div className="flex flex-row overflow-y-scroll space-x-2 py-3 px-2">
                        {banners.map((banner, index) => (
                            <img
                                onClick={() => handleBanner(banner)}
                                key={banner.id}
                                loading="lazy"
                                src={banner.image_url}
                                alt={banner.title}
                                className={`rounded w-${
                                    banners.length === 1 ||
                                    banners.length - 1 === index
                                        ? 'full'
                                        : '[80%]'
                                } min-w-[340px] h-28 object-fill`}
                                style={{
                                    transform: `translate3d(${
                                        -bannerIndex * 100
                                    }%, 0, 0)`,
                                    transition: 'ease 1000ms',
                                }}
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
                    <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-4">
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
                {_status === ALL && <AllVoucher />}
                {_status === FAVORITE && <FavoriteVoucher />}
            </div>
        </CustomerLayout>
    )
}
