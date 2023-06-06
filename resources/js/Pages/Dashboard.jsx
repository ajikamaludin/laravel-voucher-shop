import React, { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Head, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import moment from 'moment'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { formatIDR } from '@/utils'
import FormInputDateRanger from '@/Components/FormInputDateRange'
import CustomerSelectionInput from './Customer/SelectionInput'
import LocationSelectionInput from './Location/SelectionInput'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
)
export default function Dashboard(props) {
    const {
        total_voucher,
        total_customer,
        total_customer_verified,
        total_deposit,
        total_voucher_sale_this_month,
        count_voucher_sale_this_month,
        total_voucher_sale_this_day,
        count_voucher_sale_this_day,
        month,
        deposites,
        sales,
        charts,
        _startDate,
        _endDate,
    } = props

    const [dates, setDates] = useState({
        startDate: _startDate,
        endDate: _endDate,
    })
    const [customer_id, setCustomerId] = useState(null)
    const [location_id, setLocationId] = useState(null)
    const preValue = usePrevious(`${dates}${customer_id}${location_id}`)

    const options = {
        responsive: true,
        scales: {
            x: {},
        },
    }

    const data = {
        labels: charts.map((item) => moment(item.date).format('DD MMM YYYY')),
        datasets: [
            {
                label: 'Penjualan',
                data: charts.map((item) => item.sale_total),
                backgroundColor: ['rgba(255, 205, 86, 1)'],
            },
        ],
    }

    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                {
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                    customer_id,
                    location_id,
                },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [dates, customer_id, location_id])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Dashboard'}
            action={''}
        >
            <Head title="Dashboard" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="grid grid-cols-4 gap-2">
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Voucher
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_voucher)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Customer
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_customer)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Customer Verified
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_customer_verified)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Deposit
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_deposit)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Voucher terjual bulan {month}
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_voucher_sale_this_month)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Jumlah Voucher terjual bulan {month}
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(count_voucher_sale_this_month)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Total Voucher terjual hari ini
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(total_voucher_sale_this_day)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white p-4 flex flex-col">
                            <div className="text-gray-600 text-xl">
                                Jumlah Voucher terjual hari ini
                            </div>
                            <div className="font-bold text-2xl pt-2">
                                {formatIDR(count_voucher_sale_this_day)}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-row mt-4 space-x-2 border rounded-md shadow">
                        <div className="flex-1 overflow-auto bg-white p-4">
                            <div className="w-full flex flex-row justify-between mb-4">
                                <div className="tex-gray-500 text-xl pb-4">
                                    Penjualan
                                </div>

                                <div className="flex flex-row space-x-1">
                                    <LocationSelectionInput
                                        itemSelected={location_id}
                                        onItemSelected={(id) =>
                                            setLocationId(id)
                                        }
                                        placeholder="filter lokasi"
                                    />
                                    <CustomerSelectionInput
                                        itemSelected={customer_id}
                                        onItemSelected={(id) =>
                                            setCustomerId(id)
                                        }
                                        placeholder="filter customer"
                                    />
                                    <FormInputDateRanger
                                        selected={dates}
                                        onChange={(dates) => setDates(dates)}
                                    />
                                </div>
                            </div>
                            <Bar
                                options={options}
                                data={data}
                                className="max-h-96"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow border mt-4 w-full">
                        <div className="tex-gray-500 text-xl px-3 py-4">
                            Deposit Hari Ini
                        </div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4 px-2">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        #
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Customer
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Deposit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposites.map((deposit, index) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        key={`depo${index}`}
                                    >
                                        <td
                                            scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-6">
                                            {deposit.customer.name}
                                        </td>
                                        <td className="py-4 px-6">
                                            {formatIDR(deposit.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white rounded-md shadow border mt-2">
                        <div className="text-gray-500 text-xl px-3 py-4">
                            Penjualan Hari Ini
                        </div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4 px-2">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        #
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Customer
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Voucher
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale, index) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        key={`sale${index}`}
                                    >
                                        <td
                                            scope="row"
                                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-6">
                                            {sale.name}
                                        </td>
                                        <td className="py-4 px-6">
                                            {formatIDR(sale.count)}
                                        </td>
                                        <td className="py-4 px-6">
                                            {formatIDR(sale.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
