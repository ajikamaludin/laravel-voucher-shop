import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'

const ExchangeModal = ({ show, voucher, setShow }) => {
    return (
        <div
            className={`fixed z-10 top-0 left-0 h-full w-full -mt-4 ${
                show ? '' : 'invisible'
            } `}
        >
            <div
                className="max-w-md mx-auto h-full bg-gray-500 bg-opacity-70 -mt-2"
                onClick={() => setShow(false)}
            >
                <div className="flex flex-col h-full my-auto justify-center px-4">
                    <div className="px-3 py-1 shadow-md rounded border bg-white border-gray-100 hover:bg-gray-50">
                        <div className="text-base font-bold">
                            {voucher.location.name}
                        </div>
                        <div className="w-full border border-dashed"></div>
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                <div className="text-xs text-gray-400 py-1">
                                    {voucher.profile}
                                </div>
                                <div className="text-xl font-bold">
                                    {formatIDR(voucher.price_coin)} Coin
                                </div>
                            </div>
                            <div className="flex flex-col justify-end text-right">
                                <div className="text-3xl font-bold">
                                    {voucher.display_quota}
                                </div>
                                <div className="text-gray-400 ">
                                    {voucher.display_expired}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-3">
                        <div
                            className="w-full mt-2 px-3 py-1 shadow-md rounded border-blue-700 bg-blue-600 text-white hover:bg-white hover:text-black"
                            onClick={() =>
                                router.get(
                                    route(
                                        'customer.coin.exchange.process',
                                        voucher
                                    )
                                )
                            }
                        >
                            Tukarkan
                        </div>
                        <div className="w-full mt-2 px-3 py-1 shadow-md rounded border-white bg-white hover:bg-gray-200">
                            Batal
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VoucherCard({ voucher }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <div
                className="px-3 py-1 shadow-md rounded border border-gray-100 hover:bg-gray-50"
                onClick={() => setShow(true)}
            >
                <div className="text-base font-bold">
                    {voucher.location.name}
                </div>
                <div className="w-full border border-dashed"></div>
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <div className="text-xs text-gray-400 py-1">
                            {voucher.profile}
                        </div>
                        <div className="text-xl font-bold">
                            {formatIDR(voucher.price_coin)} Coin
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                        <div className="text-3xl font-bold">
                            {voucher.display_quota}
                        </div>
                        <div className="text-gray-400 ">
                            {voucher.display_expired}
                        </div>
                    </div>
                </div>
            </div>
            <ExchangeModal voucher={voucher} show={show} setShow={setShow} />
        </>
    )
}
