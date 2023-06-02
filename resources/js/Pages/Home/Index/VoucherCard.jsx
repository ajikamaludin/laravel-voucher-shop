import { formatIDR } from '@/utils'

export default function VoucherCard({ voucher }) {
    return (
        <div className="px-3 py-1 shadow-md rounded border border-gray-100">
            <div className="text-base font-bold">{voucher.location.name}</div>
            <div className="w-full border border-dashed"></div>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400 py-1">
                        {voucher.location.name}
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
                <div className="flex flex-col justify-center ">
                    <div className="text-3xl font-bold">
                        {voucher.display_quota}
                    </div>
                    <div className="text-gray-400 text-right">
                        {voucher.display_expired}
                    </div>
                </div>
            </div>
        </div>
    )
}
