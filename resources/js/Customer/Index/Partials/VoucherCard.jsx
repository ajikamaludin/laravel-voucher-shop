import Alert from '@/Components/Alert'
import BottomSheet from '@/Customer/Components/BottomSheet'
import { useModalState } from '@/hooks'
import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'

const Voucher = ({ voucher, onClick }) => {
    return (
        <div
            className="px-3 py-1 shadow-md rounded border border-gray-100 hover:bg-gray-50"
            onClick={onClick}
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
        </div>
    )
}

const ModalChoose = (props) => {
    const { state, voucher } = props

    const onDirectBuy = () => {
        router.post(route('cart.store', voucher), { direct: 1 })
        state.toggle()
    }

    const addToCarts = () => {
        router.post(route('cart.store', voucher))
        state.toggle()
    }

    return (
        <BottomSheet isOpen={state.isOpen} toggle={() => state.toggle()}>
            <Voucher voucher={voucher} />
            {voucher.location_profile.display_note !== null && (
                <div
                    className="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                    role="alert"
                >
                    {voucher.location_profile.display_note}
                </div>
            )}
            <div className="flex flex-row justify-between gap-2 mt-2">
                <div
                    className="w-full text-center px-3 py-2 rounded-lg bg-white border border-blue-700 text-blue-700 hover:bg-blue-100"
                    onClick={onDirectBuy}
                >
                    Beli Langsung
                </div>
                <div
                    className="w-full text-center px-3 py-2 rounded-lg bg-blue-700 border border-blue-900 text-white hover:bg-blue-900"
                    onClick={addToCarts}
                >
                    + Keranjang
                </div>
            </div>
        </BottomSheet>
    )
}

export default function VoucherCard({ voucher }) {
    const chooseModalState = useModalState()

    const onVoucherChoose = () => {
        chooseModalState.toggle()
    }

    return (
        <>
            <div onClick={() => onVoucherChoose()}>
                <Voucher voucher={voucher} />
            </div>
            <ModalChoose state={chooseModalState} voucher={voucher} />
        </>
    )
}
