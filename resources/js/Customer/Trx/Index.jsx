import React, { useState, useEffect } from 'react'
import { usePrevious } from 'react-use'
import { Head, router } from '@inertiajs/react'

import { formatIDDate } from '@/utils'
import CustomerLayout from '@/Layouts/CustomerLayout'
import HeaderTrx from '../Components/HeaderTrx'
import { isEmpty } from 'lodash'

const EmptyHere = () => {
    return (
        <div className="w-full px-5 text-center flex flex-col my-auto">
            <div className="font-bold text-xl">Transaksi kosong</div>
            <div className="text-gray-400">
                Yuk, checkout keranjang mu sekarang!
            </div>
        </div>
    )
}

export default function Index(props) {
    const {
        query: { data, next_page_url },
        _start_date,
        _end_date,
    } = props

    const [sales, setSales] = useState(data)

    const [dates, setDates] = useState({
        startDate: _start_date,
        endDate: _end_date,
    })
    const preValue = usePrevious(`${dates}`)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {
                startDate: dates.startDate,
                endDate: dates.endDate,
            },
            {
                replace: true,
                preserveState: true,
                only: ['query'],
                onSuccess: (res) => {
                    setSales(sales.concat(res.props.query.data))
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
                    only: ['query'],
                    onSuccess: (res) => {
                        setSales(res.props.query.data)
                    },
                }
            )
        }
    }, [dates])

    return (
        <CustomerLayout>
            <Head title="Transaksi" />
            <div className="flex flex-col min-h-[calc(90dvh)]">
                <HeaderTrx enable="trx" dates={dates} setDates={setDates} />

                <div className="w-full">
                    <div className="flex flex-col space-y-5 px-5">
                        <div className="text-sm text-gray-400">
                            {formatIDDate(dates.startDate)} s/d{' '}
                            {formatIDDate(dates.endDate)}
                        </div>
                        {sales.map((sale) => (
                            <div
                                key={sale.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route('transactions.sale.show', sale.id)
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {sale.format_human_created_at}
                                    </div>
                                    <div className="font-thin">{sale.code}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {sale.display_amount}
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

                {sales.length <= 0 && <EmptyHere />}
            </div>
        </CustomerLayout>
    )
}
