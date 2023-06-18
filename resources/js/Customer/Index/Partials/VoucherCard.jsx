import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'

export default function VoucherCard({ voucher }) {
    const addCart = () => {
        router.post(route('cart.store', voucher))
    }
    return (
        <div
            className="px-3 py-1 shadow-md rounded border border-gray-100 hover:bg-gray-50"
            onClick={addCart}
        >
            <div className="w-full flex flex-row justify-between">
                <div className="text-base font-bold">
                    {voucher.location_profile.location.name}
                </div>
                <div className="text-sm text-gray-500"></div>
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400 py-1">
                        {voucher.location_profile.display_note}
                    </div>
                    <div className="text-xl font-bold">
                        IDR {formatIDR(voucher.validate_price)}
                    </div>
                    {+voucher.discount !== 0 && (
                        <div className="flex flex-row space-x-2 items-center text-xs pb-2">
                            <div className="bg-red-300 text-red-600 px-1 py-0.5 font-bold rounded">
                                {voucher.discount}%
                            </div>
                            <div className="text-gray-400 line-through">
                                {formatIDR(voucher.validate_display_price)}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-end text-right">
                    <div className="text-3xl font-bold">
                        {voucher.location_profile.quota}
                    </div>
                    <div className="text-gray-400 ">
                        {voucher.location_profile.diplay_expired}
                    </div>
                </div>
            </div>
        </div>
    )
}
