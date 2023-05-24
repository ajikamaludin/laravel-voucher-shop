import React from 'react'
import { Head } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'
import { HiOutlineBell } from 'react-icons/hi2'
import { HiOutlineCash } from 'react-icons/hi'

export default function Index({ status }) {
    return (
        <CustomerLayout>
            <Head title="Home" />
            <div className="flex flex-col">
                {/* user */}
                <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                    <div className="flex flex-col text-white">
                        <div className="font-bold">Aji</div>
                        <div className="flex flex-row items-center space-x-1">
                            <div>083840745543</div>
                            <div className="text-xs font-semibold px-2 py-1 bg-white text-black rounded-xl">
                                Gold
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <HiOutlineBell className="text-white w-7 h-7" />
                        <div>
                            <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                                1
                            </div>
                        </div>
                    </div>
                </div>

                {/* saldo */}
                <div className="flex flex-row px-5 pb-3 text-base bg-blue-600">
                    <div className="flex flex-row w-full shadow py-2 px-2 rounded bg-white items-center justify-between">
                        <div className="flex flex-col">
                            <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                                <HiOutlineCash />
                                <div>Saldo</div>
                            </div>
                            <div className="font-bold">Rp 10.000</div>
                            <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                                <div>Coin 10.000</div>
                            </div>
                        </div>
                        <div className="flex flex-col border-l-2 pl-5 pr-5">
                            <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                                {/* <HiOutlineAwa /> */}
                                <div>Rewards</div>
                            </div>
                            <div className="font-bold">Gold Member</div>
                            <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                                <div>Limit 100.000</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* banner */}
                <div className="w-full">
                    <div className="flex flex-row overflow-y-scroll space-x-2 py-3 px-2">
                        <img
                            src="/sample/1.webp"
                            className="rounded w-[80%] min-w-[340px] h-28 object-cover"
                        />
                        <img
                            src="/sample/banner.jpg"
                            className="rounded w-[80%] min-w-[340px]  h-28 object-cover"
                        />
                        <img
                            src="/sample/2.webp"
                            className="rounded w-[80%] min-w-[340px]  h-28 object-cover"
                        />

                        <img
                            src="/sample/3.webp"
                            className="rounded w-[80%] min-w-[340px] h-28 object-cover"
                        />
                    </div>
                </div>

                {/* info */}
                <div className="w-full px-3">
                    {[1, 2].map((x) => (
                        <div
                            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50"
                            role="alert"
                            key={x}
                        >
                            <span className="font-medium">Info! </span> Change a
                            few things up and try submitting again.
                        </div>
                    ))}
                </div>

                {/* voucher */}
                <div className="w-full flex flex-col">
                    {/* chips */}
                    <div className="w-full flex flex-row overflow-y-scroll space-x-2 px-2">
                        <div className="px-2 py-1 rounded-2xl text-white bg-blue-600 border border-blue-800">
                            Jarbriel.id
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Shaff.net
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Weslycamp.net
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Glory.net
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Salgo.id
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Terna.id
                        </div>
                        <div className="px-2 py-1 rounded-2xl  bg-blue-100 border border-blue-200">
                            Kanza.id
                        </div>
                    </div>

                    {/* voucher */}
                    <div className="flex flex-col w-full px-3 mt-3 space-y-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                            <div
                                className="px-3 py-1 shadow-md rounded border border-gray-100"
                                key={x}
                            >
                                <div className="text-base font-bold">
                                    Lawaranet voucher internet sedap
                                </div>
                                <div className="w-full border border-dashed"></div>
                                <div className="flex flex-row justify-between items-center">
                                    <div>
                                        <div className="text-xs text-gray-400 py-1">
                                            Jabriel.net
                                        </div>
                                        <div className="text-xl font-bold">
                                            IDR 10.000
                                        </div>
                                        <div className="flex flex-row space-x-2 items-center text-xs pb-2">
                                            <div className="bg-red-300 text-red-600 px-1 py-0.5 font-bold rounded">
                                                50%
                                            </div>
                                            <div className="text-gray-400 line-through">
                                                20.000
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="text-3xl font-bold">
                                            8GB
                                        </div>
                                        <div className="text-gray-400">
                                            3 Hari
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
