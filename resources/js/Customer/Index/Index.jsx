import Reactm, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import Carousel from 'nuka-carousel'

import { handleBanner, ALL, FAVORITE } from './utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import UserBanner from './Partials/UserBanner'
import AllVoucher from './IndexPartials/AllVoucher'
import FavoriteVoucher from './IndexPartials/FavoriteVoucher'
import GuestBanner from './Partials/GuestBanner'

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
                <div className="w-full px-2 py-3">
                    <Carousel
                        autoplay={true}
                        autoplayInterval={3000}
                        withoutControls={true}
                        wrapAround={true}
                        cellSpacing={10}
                    >
                        {banners.map((banner, index) => (
                            <img
                                onClick={() => handleBanner(banner)}
                                key={banner.id}
                                loading="lazy"
                                src={banner.image_url}
                                alt={banner.title}
                                className={`rounded min-w-[340px] h-28 object-fill`}
                            />
                        ))}
                    </Carousel>
                </div>

                {/* info */}
                <div className="w-full px-3">
                    {infos.map((info) => (
                        <div
                            dangerouslySetInnerHTML={{__html: info.description}}
                            key={info.id}
                        />
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
