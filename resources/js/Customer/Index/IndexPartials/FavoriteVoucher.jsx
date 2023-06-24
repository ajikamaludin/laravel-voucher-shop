import React, { useEffect, useState } from 'react'
import { router, usePage, useForm } from '@inertiajs/react'
import { HiOutlineStar } from 'react-icons/hi2'

import VoucherCard from '../Partials/VoucherCard'

const EmptyFavorite = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Belum ada favorite</div>
            <div className="text-gray-400">
                pilih lokasi favorite di daftar semua lokasi
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

export default function FavoriteVoucher() {
    const {
        props: {
            vouchers: { data, next_page_url },
            _flocations,
        },
    } = usePage()
    const { post, processing } = useForm({})

    const nextPageUrl = next_page_url === undefined ? null : next_page_url
    const [items, setItems] = useState(data === undefined ? [] : data)

    const handleRemoveLocation = (location) => {
        if (processing) {
            return
        }
        post(route('customer.location.favorite', location), {
            onSuccess: () => {
                router.visit(route(route().current()))
            },
        })
    }

    const handleNextPage = () => {
        router.get(
            nextPageUrl,
            {},
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

    useEffect(() => {
        setItems(data)
    }, [_flocations])

    return (
        <>
            <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-4 mt-2">
                {_flocations.map((location) => (
                    <div
                        className="flex flex-row items-center gap-1 px-2 py-1 rounded-2xl bg-blue-100 border border-blue-200"
                        key={location.id}
                    >
                        <div>{location.name}</div>
                        <div
                            className="pl-2"
                            onClick={() => handleRemoveLocation(location)}
                        >
                            <HiOutlineStar className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                        </div>
                    </div>
                ))}
            </div>
            {_flocations.length <= 0 && <EmptyFavorite />}

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
            {items.length <= 0 && _flocations.length > 0 && <EmptyVoucher />}
        </>
    )
}
