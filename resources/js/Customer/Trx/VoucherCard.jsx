import { formatIDR } from '@/utils'
import { HiClipboardDocumentList, HiShare } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import { toastSuccess } from '../utils'

export default function VoucherCard(props) {
    const {
        item: { share_word, additional_info_json },
    } = props

    const sale_item = JSON.parse(additional_info_json)
    const voucher = sale_item?.voucher

    const handleShare = () => {
        if (navigator.canShare) {
            navigator.share({
                title: share_word,
                text: share_word,
            })
            return
        }

        navigator.clipboard.writeText(share_word)
        toastSuccess('copied to clipboard')
        return
    }

    const handleCopyToClipboard = (text) => {
        toastSuccess('copied to clipboard')
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="px-2 py-0 shadow-md rounded border border-gray-100">
            <div className="w-full flex flex-row justify-between items-end my-1">
                <div className="text-base font-bold">
                    {voucher.location_profile.location.name}
                </div>
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400 py-1">
                        {voucher.location_profile.display_note}
                    </div>
                    <div className="text-xl font-bold">
                        Rp {formatIDR(voucher.validate_price)}
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
            <div className="w-full border border-dashed"></div>
            <div className="w-full flex flex-row justify-between items-center py-1">
                <div className="w-full flex flex-col space-y-2 py-2 px-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
                    <div className="flex flex-row space-x-2 items-center">
                        <div>Kode : </div>
                        <div className="font-bold">{voucher.username}</div>
                        <div
                            className="pl-2"
                            onClick={() =>
                                handleCopyToClipboard(voucher.username)
                            }
                        >
                            <HiClipboardDocumentList className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row w-full justify-end pb-1">
                <div
                    className="text-right flex flex-row items-center space-x-2 font-bold p-1 border rounded hover:bg-gray-100"
                    onClick={() => handleShare()}
                >
                    <HiShare className="w-6 h-6" />
                    <div>Share</div>
                </div>
            </div>
        </div>
    )
}
