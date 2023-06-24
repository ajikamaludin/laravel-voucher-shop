import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiChevronLeft } from 'react-icons/hi2'
import { BsWhatsapp } from 'react-icons/bs'
import { GrMap } from 'react-icons/gr'

export default function Index({ locations: { data, next_page_url } }) {
    const [locations, setLocations] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['locations'],
                onSuccess: (res) => {
                    setLocations(locations.concat(res.props.locations.data))
                },
            }
        )
    }
    return (
        <CustomerLayout>
            <Head title="Lokasi Setor Tunai" />
            <div className="flex flex-col min-h-[calc(90dvh)]">
                <div
                    className="w-full px-5 py-5 flex flex-row items-center"
                    onClick={() => {
                        router.get(route('transactions.deposit.topup'))
                    }}
                >
                    <div>
                        <HiChevronLeft className="font-bold h-5 w-5" />
                    </div>
                    <div className="pl-4 text-xl font-bold">
                        Lokasi Setor Tunai
                    </div>
                </div>
                <div className="w-full px-2 flex flex-col gap-1">
                    {locations.map((location) => (
                        <div
                            key={location.id}
                            className="border rounded-lg px-2 py-2 flex flex-row w-full gap-2"
                        >
                            <img
                                src={location.image_url}
                                className="object-fill h-36 w-32"
                            />
                            <div className="flex flex-col w-full">
                                <div className="font-bold">{location.name}</div>
                                <div>
                                    <a
                                        target="_blank"
                                        href={`https://wa.me/+62${location.phone}`}
                                    >
                                        <span>+62{location.phone}</span>
                                    </a>
                                </div>
                                <div>
                                    Alamat : <span>{location.address}</span>
                                </div>
                                <div>
                                    Jam Buka :{' '}
                                    <span className="font-bold">
                                        {location.operational_hour}
                                    </span>
                                </div>
                                <div className="pt-2 flex flex-row gap-2 items-center">
                                    <a
                                        target="_blank"
                                        href={`https://wa.me/+62${location.phone}`}
                                        className="flex flex-row gap-2 border px-2 py-1 rounded items-center text-green-500 hover:bg-green-400 hover:text-white"
                                    >
                                        <BsWhatsapp className="w-5 h-5" />
                                        <span>Whatsapp</span>
                                    </a>
                                    <a
                                        target="_blank"
                                        href={location.gmap_url}
                                        className="flex flex-row gap-2 border px-2 py-1 rounded items-center text-gray-500 hover:bg-gray-400 hover:text-white"
                                    >
                                        <GrMap className="w-5 h-5" />
                                        <span>Lokasi</span>
                                    </a>
                                </div>
                            </div>
                        </div>
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
        </CustomerLayout>
    )
}
