import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'

import { formatIDDate } from '@/utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import HeaderTrx from '../Components/HeaderTrx'
import { isEmpty } from 'lodash'

const EmptyHere = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Transaksi kosong</div>
            <div className="text-gray-400">
                Yuk kumpulkan poin sebanyak banyaknya dengan share link refferal
                kamu
            </div>
        </div>
    )
}

export default function Index(props) {
    const {
        poins: { data, next_page_url },
        _start_date,
        _end_date,
    } = props
    const [_poins, setpoins] = useState(data)

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
                only: ['poins'],
                onSuccess: (res) => {
                    setpoins(_poins.concat(res.props.poins.data))
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
                    only: ['poins'],
                    onSuccess: (res) => {
                        setpoins(res.props.poins.data)
                    },
                }
            )
        }
    }, [dates])

    return (
        <CustomerLayout>
            <Head title="Poin" />
            <div className="flex flex-col w-full min-h-[calc(90dvh)]">
                <HeaderTrx enable="poin" dates={dates} setDates={setDates} />
                <div className="w-full">
                    <div className="flex flex-col py-1 space-y-5 px-5">
                        <div className="text-sm text-gray-400">
                            {formatIDDate(dates.startDate)} s/d{' '}
                            {formatIDDate(dates.endDate)}
                        </div>
                        {_poins.map((poin) => (
                            <div
                                key={poin.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route('transactions.poin.show', poin.id)
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {poin.format_human_created_at}
                                    </div>
                                    <div className="font-thin">
                                        {poin.description}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {poin.amount} poin
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
                {_poins.length <= 0 && <EmptyHere />}
            </div>
        </CustomerLayout>
    )
}
