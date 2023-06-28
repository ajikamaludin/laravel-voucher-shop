import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import BottomSheet from '../Components/BottomSheet'

const ExchangeModal = ({ show, voucher, setShow }) => {
    return (
        <BottomSheet isOpen={show} toggle={() => setShow(false)}>
            <div className="flex flex-col h-full my-auto justify-center px-2 mt-2">
                <div className="px-3 py-1 shadow-md rounded border bg-white border-gray-100 hover:bg-gray-50">
                    <div className="text-base font-bold">
                        {voucher.location_profile.name}
                    </div>
                    <div className="w-full border border-dashed"></div>
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-400 py-1">
                                {voucher.location_profile.display_note}
                            </div>
                            <div className="text-xl font-bold">
                                {formatIDR(voucher.location_profile.price_poin)}{' '}
                                poin{' '}
                            </div>
                        </div>
                        <div className="flex flex-col justify-end text-right">
                            <div className="text-3xl font-bold">
                                {voucher.location_profile.quota}
                            </div>
                            <div className="text-gray-400 ">
                                {voucher.location_profile.display_expired}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row space-x-3 mt-2">
                    <div
                        className="w-full text-center px-3 py-2 rounded-lg bg-blue-700 border border-blue-900 text-white hover:bg-blue-900"
                        onClick={() =>
                            router.get(
                                route('customer.poin.exchange.process', voucher)
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

export default function VoucherCard({ voucher }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <div
                className="px-3 py-1 shadow-md rounded border border-gray-100 hover:bg-gray-50"
                onClick={() => setShow(true)}
            >
                <div className="text-base font-bold">
                    {voucher.location_profile.location.name}
                </div>
                <div className="w-full border border-dashed"></div>
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <div className="text-xs text-gray-400 py-1">
                            {voucher.location_profile.display_note}
                        </div>
                        <div className="text-xl font-bold">
                            {formatIDR(voucher.validate_price_poin)} poin
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                        <div className="text-3xl font-bold">
                            {voucher.location_profile.quota}
                        </div>
                        <div className="text-gray-400 ">
                            {voucher.location_profile.display_expired}
                        </div>
                    </div>
                </div>
            </div>
            <ExchangeModal voucher={voucher} show={show} setShow={setShow} />
        </>
    )
}
