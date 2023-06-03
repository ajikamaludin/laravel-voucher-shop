import { formatIDR } from '@/utils'
import { HiShare } from 'react-icons/hi2'

export default function VoucherCard({ item: { voucher, quantity } }) {
    return (
        <div className="px-3 py-1 shadow-md rounded border border-gray-100">
            <div className="w-full flex flex-row justify-between py-0.5">
                <div className="text-base font-bold">
                    {voucher.location.name}
                </div>
                <div
                    className="text-right"
                    onClick={() => {
                        navigator.share({
                            title: 'Hello World',
                            text: 'Hai Hai',
                        })
                    }}
                >
                    <HiShare className="w-6 h-6" />
                </div>
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400 py-1">
                        {voucher.profile}
                    </div>
                    <div className="text-xl font-bold">
                        IDR {formatIDR(voucher.price)}
                    </div>
                    {+voucher.discount !== 0 && (
                        <div className="flex flex-row space-x-2 items-center text-xs pb-2">
                            <div className="bg-red-300 text-red-600 px-1 py-0.5 font-bold rounded">
                                {voucher.discount}%
                            </div>
                            <div className="text-gray-400 line-through">
                                {formatIDR(voucher.display_price)}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-end">
                    <div className="text-3xl font-bold">
                        {voucher.display_quota}
                    </div>
                    <div className="text-gray-400">
                        {voucher.display_expired}
                    </div>
                </div>
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="w-full flex flex-row justify-between items-center pt-1">
                <div>{formatIDR(voucher.price)}</div>
                <div>x</div>
                <div>{quantity}</div>
                <div>{formatIDR(+voucher.price * +quantity)}</div>
            </div>
            <div className="w-full flex flex-row justify-between items-center py-1">
                <div className="w-full py-1 px-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
                    <div>
                        Username :{' '}
                        <span className="font-bold">{voucher.username}</span>
                    </div>
                    <div>
                        Password :{' '}
                        <span className="font-bold">{voucher.password}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
