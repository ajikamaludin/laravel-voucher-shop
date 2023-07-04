import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'

import CustomerLayout from '@/Layouts/CustomerLayout'
import HeaderTrx from '../Components/HeaderTrx'
import { formatIDDate } from '@/utils'
import { isEmpty } from 'lodash'

const EmptyHere = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Transaksi kosong</div>
            <div className="text-gray-400">
                Yuk, topup saldo kamu sekarang juga
            </div>
        </div>
    )
}

export default function Index(props) {
    const {
        histories: { data, next_page_url },
        _start_date,
        _end_date,
    } = props

    const [deposites, setDeposites] = useState(data)

    const [dates, setDates] = useState({
        startDate: _start_date,
        endDate: _end_date,
    })
    const preValue = usePrevious(`${dates}`)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            { startDate: dates.startDate, endDate: dates.endDate },
            {
                replace: true,
                preserveState: true,
                only: ['histories'],
                onSuccess: (res) => {
                    setDeposites(deposites.concat(res.props.histories.data))
                },
            }
        )
    }

    useEffect(() => {
        if (preValue) {
            if (isEmpty(dates.endDate)) {
                return
            }
            router.get(
                route(route().current()),
                {
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                },
                {
                    replace: true,
                    preserveState: true,
                    only: ['histories'],
                    onSuccess: (res) => {
                        setDeposites(res.props.histories.data)
                    },
                }
            )
        }
    }, [dates])

    return (
        <CustomerLayout>
            <Head title="Top Up" />
            <div className="flex flex-col w-full min-h-[calc(90dvh)]">
                <HeaderTrx dates={dates} setDates={setDates} />

                <div className="w-full">
                    <div className="flex flex-col space-y-5 px-5">
                        <div className="text-sm text-gray-400">
                            {formatIDDate(dates.startDate)} s/d{' '}
                            {formatIDDate(dates.endDate)}
                        </div>
                        {deposites.map((history) => (
                            <div
                                key={history.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route(
                                            'transactions.deposit.show',
                                            history.id
                                        )
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {history.format_human_created_at}
                                    </div>
                                    <div className="font-thin">
                                        {history.description}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {history.amount}
                                    </div>
                                    {+history.is_valid !== 0 && (
                                        <div
                                            className={`text-xs ${history.status.text_color}`}
                                        >
                                            {history.status.text}
                                        </div>
                                    )}
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

                {deposites.length <= 0 && <EmptyHere />}
            </div>
        </CustomerLayout>
    )
}
