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
import { Bar } from 'react-chartjs-2'
import { Head, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import moment from 'moment'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { formatIDR } from '@/utils'
import FormInputDateRanger from '@/Components/FormInputDateRange'
import CustomerSelectionInput from './Customer/SelectionInput'
import LocationSelectionInput from './Location/SelectionInput'
import FormInputYearPicker from '@/Components/FormInputYearPicker'
import Checkbox from '@/Components/Checkbox'

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
        deposites,
        sales,
        sales_deposit_charts,
        sales_paylater_charts,
        _dates,
        _startDate,
        _endDate,
        _payment,
        deposit_year_sale_charts,
        paylater_year_sale_charts,
        _year_payment,
        _months,
        _year,
    } = props

    // filter perhari
    const [payment, setPayment] = useState(_payment)
    const [dates, setDates] = useState({
        startDate: _startDate,
        endDate: _endDate,
    })
    const [customer_id, setCustomerId] = useState(null)
    const [location_id, setLocationId] = useState(null)

    // filter per tahun
    const [year_payment, setYearPayment] = useState(_year_payment)
    const [year, setYear] = useState(_year)
    const [year_customer_id, setYearCustomerId] = useState(null)
    const [year_location_id, setYearLocationId] = useState(null)

    // filter
    const preValue = usePrevious({
        dates,
        customer_id,
        location_id,
        payment,
        year,
        year_customer_id,
        year_location_id,
        year_payment,
    })

    const options = {
        responsive: true,
        scales: {
            x: {},
        },
    }

    const data = {
        labels: _dates.map((item) =>
            moment(item.date, 'DD/MM/YYYY').format('DD MMM YYYY')
        ),
        datasets: [
            {
                label: 'Penjualan (Rp) Deposit',
                data: sales_deposit_charts.map((item) => item.sale_total),
                backgroundColor: ['rgba(255, 205, 86, 1)'],
            },
            {
                label: 'Penjualan (Rp) Hutang',
                data: sales_paylater_charts.map((item) => item.sale_total),
                backgroundColor: ['#b91c1c'],
            },
        ],
    }

    const data_month = {
        labels: _months.map((item) => moment(item.month, 'MM').format('MMM')),
        datasets: [
            {
                label: 'Penjualan (Rp) Deposit',
                data: deposit_year_sale_charts.map((item) => item.sale_total),
                backgroundColor: ['rgba(255, 205, 86, 1)'],
            },
            {
                label: 'Penjualan (Rp) Hutang',
                data: paylater_year_sale_charts.map((item) => item.sale_total),
                backgroundColor: ['#b91c1c'],
            },
        ],
    }

    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                {
                    start_date: dates.startDate,
                    end_date: dates.endDate,
                    customer_id,
                    location_id,
                    payment,
                    year,
                    year_customer_id,
                    year_location_id,
                    year_payment,
                },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [
        dates,
        customer_id,
        location_id,
        payment,
        year,
        year_customer_id,
        year_location_id,
        year_payment,
    ])

    return (
        <AuthenticatedLayout page={'Dashboard'} action={''}>
            <Head title="Dashboard" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="w-full flex flex-row mt-4 space-x-2 border dark:border-gray-900 rounded-md shadow">
                        <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 p-4 rounded-md">
                            <div className="w-full flex flex-col justify-between mb-4">
                                <div className="text-gray-500 text-xl pb-4">
                                    Penjualan Perhari
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 w-full justify-end">
                                    <div>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) =>
                                                setPayment(e.target.value)
                                            }
                                            value={payment}
                                        >
                                            <option value="">
                                                Semua Pembayaran
                                            </option>
                                            <option value="paylater">
                                                Saldo Hutang
                                            </option>
                                            <option value="deposit">
                                                Saldo Deposit
                                            </option>
                                        </select>
                                    </div>
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
                    <div className="w-full flex flex-row mt-4 space-x-2 border dark:border-gray-900 rounded-md shadow">
                        <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 p-4 rounded-md">
                            <div className="w-full flex flex-col justify-between mb-4">
                                <div className="text-gray-500 text-xl pb-4">
                                    Penjualan Perbulan
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 w-full justify-end">
                                    <div>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) =>
                                                setYearPayment(e.target.value)
                                            }
                                            value={year_payment}
                                        >
                                            <option value="">
                                                Semua Pembayaran
                                            </option>
                                            <option value="paylater">
                                                Saldo Hutang
                                            </option>
                                            <option value="deposit">
                                                Saldo Deposit
                                            </option>
                                        </select>
                                    </div>
                                    <LocationSelectionInput
                                        itemSelected={year_location_id}
                                        onItemSelected={(id) =>
                                            setYearLocationId(id)
                                        }
                                        placeholder="filter lokasi"
                                    />
                                    <CustomerSelectionInput
                                        itemSelected={year_customer_id}
                                        onItemSelected={(id) =>
                                            setYearCustomerId(id)
                                        }
                                        placeholder="filter customer"
                                    />
                                    <FormInputYearPicker
                                        selected={year}
                                        onChange={(date) => setYear(date)}
                                    />
                                </div>
                            </div>
                            <Bar
                                options={options}
                                data={data_month}
                                className="max-h-96"
                            />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-md shadow border dark:border-gray-800 mt-4 w-full">
                        <div className="text-gray-500 text-xl px-3 py-4">
                            Deposit Hari Ini
                        </div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4 px-2">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
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
                    <div className="bg-white dark:bg-gray-800 dark:border-gray-800  rounded-md shadow border mt-2">
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
