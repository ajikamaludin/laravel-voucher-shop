import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { HiMinusCircle, HiPlusCircle, HiTrash } from 'react-icons/hi2'

export default function VoucherCard({ item: { voucher, quantity } }) {
    const handleDelete = () => {
        router.post(route('cart.store', { voucher: voucher, param: 'delete' }))
    }

    const handleAdd = () => {
        router.post(route('cart.store', { voucher: voucher, param: 'add' }))
    }

    const handleSub = () => {
        router.post(route('cart.store', { voucher: voucher, param: 'sub' }))
    }

    return (
        <div className="px-3 py-1 shadow-md rounded border border-gray-100">
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
                    <div className="text-gray-400">
                        {voucher.location_profile.diplay_expired}
                    </div>
                </div>
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="w-full flex flex-row justify-between items-center pt-1">
                <div>{formatIDR(voucher.validate_price)}</div>
                <div>x</div>
                <div>{quantity}</div>
                <div>{formatIDR(+voucher.validate_price * +quantity)}</div>
            </div>
            <div className="w-full flex flex-row justify-end items-center space-x-2 py-2">
                <HiTrash
                    className="text-red-700 w-6 h-6 rounded-full border mr-4 hover:bg-red-700"
                    onClick={handleDelete}
                />
                <HiMinusCircle
                    className="text-gray-400 w-6 h-6 rounded-full border hover:bg-gray-400"
                    onClick={handleSub}
                />
                <div>{quantity}</div>
                <HiPlusCircle
                    className="text-gray-400 w-6 h-6 rounded-full border hover:bg-gray-400"
                    onClick={handleAdd}
                />
            </div>
        </div>
    )
}
