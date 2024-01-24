import { formatIDR } from '@/utils'
import { router } from '@inertiajs/react'
import { isEmpty } from 'lodash'
import { HiOutlineCash } from 'react-icons/hi'

export default function BalanceBanner({ user }) {
    return (
        <div className="flex flex-row px-5 pb-3 text-base bg-primary-900">
            <div className="flex flex-row w-full shadow py-2 px-2 rounded bg-white items-center justify-between">
                <div
                    className="flex flex-col w-full"
                    onClick={() =>
                        router.get(route('transactions.deposit.index'))
                    }
                >
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <HiOutlineCash />
                        <div>Saldo</div>
                    </div>
                    <div className="font-bold">Rp {user.display_deposit}</div>
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <div>poin {user.display_poin}</div>
                    </div>
                </div>
                <div
                    className="flex flex-col w-[200px] border-l-2 pl-2"
                    onClick={() =>
                        router.get(route('customer.customer-level.index'))
                    }
                >
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        <div>Rewards</div>
                    </div>
                    <div className="font-bold">{user.level.name}</div>
                    <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                        {user.paylater_remain !== '' && (
                            <div>Limit : {formatIDR(user.paylater_remain)}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
