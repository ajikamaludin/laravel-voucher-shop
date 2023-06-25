import React, { useState, useEffect } from 'react'
import { usePage, router, Link } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { HiOutlineFilter } from 'react-icons/hi'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2'

import { useModalState } from '@/hooks'
import BottomSheet from './BottomSheet'
import FormInputDateRanger from '@/Components/FormInputDateRange'

const FilterSheet = ({ state, dates, setDates, setApply }) => {
    const apply = () => {
        setApply(true)
        state.toggle()
    }

    return (
        <BottomSheet isOpen={state.isOpen} toggle={() => state.toggle()}>
            <div className="flex flex-col min-h-[calc(50dvh)] px-5">
                <div className="mb-2 font-bold text-lg">Filter Tanggal</div>
                <FormInputDateRanger
                    selected={dates}
                    onChange={(dates) => setDates(dates)}
                />
                <div
                    onClick={() => apply()}
                    className="mt-5 font-semibold h-11 border bg-blue-700 text-white px-5 py-2 rounded-full hover:text-black hover:bg-white"
                >
                    Apply
                </div>
            </div>
        </BottomSheet>
    )
}

export default function HeaderTrx({ enable = 'deposit', dates, setDates }) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()

    const filterModal = useModalState()

    const [popover, setPopover] = useState(false)
    const [isApply, setApply] = useState(false)

    return (
        <>
            <div className="w-full pt-10 px-5">
                <div className="text-base">{user.fullname}</div>
            </div>
            <div className="flex flex-row justify-between items-center px-5">
                <div>
                    <div className="font-bold text-3xl">
                        Rp {user.display_deposit}
                    </div>
                </div>
                <div>
                    <div
                        className="px-3 py-2 border rounded-full bg-blue-700 text-white hover:bg-transparent hover:text-black"
                        onClick={() =>
                            router.get(route('transactions.deposit.topup'))
                        }
                    >
                        Top Up
                    </div>
                </div>
            </div>
            <div className="px-5 pb-5 border-b">
                <div className="flex flex-row items-center text-gray-600 text-sm">
                    <div>{user.display_poin} poin</div>
                    <div className="pl-1" onClick={() => setPopover(!popover)}>
                        <HiOutlineQuestionMarkCircle className="h-4 w-4" />

                        <div
                            className={`${
                                popover ? '' : 'invisible'
                            } absolute z-10 inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400`}
                        >
                            <div className="p-2 ">{user.poin_expired_text}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-row justify-between items-center px-5 py-5">
                    <div className="flex flex-row gap-2 ">
                        <Link
                            href={route('transactions.deposit.index')}
                            className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                                enable === 'deposit'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-blue-100'
                            }`}
                        >
                            Deposit
                        </Link>
                        <Link
                            href={route('transactions.sale.index')}
                            className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                                enable === 'trx'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-blue-100'
                            }`}
                        >
                            Pembelian
                        </Link>
                        <Link
                            href={route('transactions.poin.index')}
                            className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                                enable === 'poin'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-blue-100'
                            }`}
                        >
                            Poin
                        </Link>
                    </div>
                    <div
                        className="flex flex-row"
                        onClick={() => filterModal.toggle()}
                    >
                        <HiOutlineFilter className="h-6 w-6" />
                        {/* only show on filter */}
                        {isApply && (
                            <div>
                                <div className="bg-blue-300 text-blue-600 rounded-lg px-1 text-xs -ml-3 -mt-1">
                                    1
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FilterSheet
                state={filterModal}
                dates={dates}
                setDates={setDates}
                setApply={setApply}
            />
        </>
    )
}
