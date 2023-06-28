import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import BottomSheet from '../Components/BottomSheet'

const ExchangeModal = ({ show, item, setShow }) => {
    return (
        <BottomSheet isOpen={show} toggle={() => setShow(false)}>
            <div className="flex flex-col h-full my-auto justify-center px-2 mt-2">
                <div className="px-3 py-1 shadow-md rounded border bg-white border-gray-100 hover:bg-gray-50">
                    <div className="text-base font-bold">
                        {item.location.name}
                    </div>
                    <div className="w-full border border-dashed"></div>
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-400 py-1">
                                {item.display_note}
                            </div>
                            <div className="text-xl font-bold">
                                {formatIDR(item.validate_price_poin)} poin{' '}
                            </div>
                        </div>
                        <div className="flex flex-col justify-end text-right">
                            <div className="text-3xl font-bold">
                                {item.quota}
                            </div>
                            <div className="text-gray-400 ">
                                {item.display_expired}
                            </div>
                        </div>
                    </div>
                </div>
                {item.display_note !== null && (
                    <div
                        className="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                        role="alert"
                    >
                        {item.display_note}
                    </div>
                )}
                <div className="flex flex-row space-x-3 mt-2">
                    <div
                        className="w-full text-center px-3 py-2 rounded-lg bg-blue-700 border border-blue-900 text-white hover:bg-blue-900"
                        onClick={() =>
                            router.get(
                                route('customer.poin.exchange.process', item)
                            )
                        }
                    >
                        Tukarkan
                    </div>
                    <div
                        className="w-full text-center px-3 py-2 rounded-lg bg-white border border-blue-700 text-blue-700 hover:bg-blue-100"
                        onClick={() => setShow(false)}
                    >
                        Batal
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}

export default function VoucherCard({ item }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <div
                className="px-3 py-1 shadow-md rounded border border-gray-100 hover:bg-gray-50"
                onClick={() => setShow(true)}
            >
                <div className="text-base font-bold">{item.location.name}</div>
                <div className="w-full border border-dashed"></div>
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <div className="text-xs text-gray-400 py-1">
                            {item.display_note}
                        </div>
                        <div className="text-xl font-bold">
                            {formatIDR(item.validate_price_poin)} poin
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                        <div className="text-3xl font-bold">{item.quota}</div>
                        <div className="text-gray-400 ">
                            {item.display_expired}
                        </div>
                    </div>
                </div>
            </div>
            <ExchangeModal item={item} show={show} setShow={setShow} />
        </>
    )
}
