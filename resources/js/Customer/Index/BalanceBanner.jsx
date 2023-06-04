import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { HiOutlineCash } from 'react-icons/hi'

export default function BalanceBanner({ user }) {
    return (
        <div
            className="flex flex-row px-5 pb-3 text-base bg-blue-600"
            onClick={() => router.get(route('customer.deposit.index'))}
        >
            <div className="flex flex-row w-full shadow py-2 px-2 rounded bg-white items-center justify-between">
                <div className="flex flex-col">
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <HiOutlineCash />
                        <div>Saldo</div>
                    </div>
                    <div className="font-bold">Rp {user.display_deposit}</div>
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <div>Coin {user.display_coin}</div>
                    </div>
                </div>
                <div className="flex flex-col border-l-2 pl-5 pr-5">
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        {/* <HiOutlineAwa /> */}
                        <div>Rewards</div>
                    </div>
                    <div className="font-bold">{user.level.name} Member</div>
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <div>{formatIDR(user.paylater_limit)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
