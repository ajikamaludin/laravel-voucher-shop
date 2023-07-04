import { formatIDR } from '@/utils'
import { router, usePage } from '@inertiajs/react'
import { HiMinusCircle, HiPlusCircle, HiTrash } from 'react-icons/hi2'

export default function VoucherCard({ item, onRemove, onChangeQty }) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()

    const { location_profile, quantity } = item

    const handleDelete = () => {
        onRemove(item)
        fetch(
            route('api.cart.store', {
                profile: location_profile,
                param: 'delete',
            }),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    user: user.id,
                },
            }
        )
    }

    const handleAdd = () => {
        const qty = +quantity + 1
        onChangeQty(item, qty)
        fetch(
            route('api.cart.store', {
                profile: location_profile,
                param: 'add',
            }),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    user: user.id,
                },
            }
        )
    }

    const handleSub = () => {
        const qty = +quantity - 1
        if (qty <= 0) {
            return
        }
        onChangeQty(item, qty)
        fetch(
            route('api.cart.store', {
                profile: location_profile,
                param: 'sub',
            }),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    user: user.id,
                },
            }
        )
    }

    return (
        <div className="px-3 py-1 shadow-md rounded border border-gray-100">
            <div className="text-base font-bold">
                {location_profile.location.name}
            </div>
            <div className="w-full border border-dashed"></div>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <div className="text-xs text-gray-400 py-1">
                        {location_profile.display_note}
                    </div>
                    <div className="text-xl font-bold">
                        Rp {formatIDR(location_profile.validate_price)}
                    </div>
                    {+location_profile.discount !== 0 && (
                        <div className="flex flex-row space-x-2 items-center text-xs pb-2">
                            <div className="bg-red-300 text-red-600 px-1 py-0.5 font-bold rounded">
                                {location_profile.discount}%
                            </div>
                            <div className="text-gray-400 line-through">
                                {formatIDR(
                                    location_profile.validate_display_price
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-end text-right">
                    <div className="text-3xl font-bold">
                        {location_profile.quota}
                    </div>
                    <div className="text-gray-400">
                        {location_profile.display_expired}
                    </div>
                </div>
            </div>
            <div className="w-full border border-dashed"></div>
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
