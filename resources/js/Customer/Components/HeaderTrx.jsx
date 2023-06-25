import { usePage, router, Link } from '@inertiajs/react'
import { useState } from 'react'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2'

export default function HeaderTrx({ enable = 'deposit' }) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()

    const [popover, setPopover] = useState(false)

    return (
        <>
            <div className="w-full pt-10 px-5">
                <div className="text-base">{user.fullname}</div>
            </div>
            <div className="flex flex-row justify-between items-center px-5">
                <div>
                    <div className="font-bold text-3xl">
                        Rp {user.display_deposit}
                    </div>
                </div>
                <div>
                    <div
                        className="px-3 py-2 border rounded-full bg-blue-700 text-white hover:bg-transparent hover:text-black"
                        onClick={() =>
                            router.get(route('transactions.deposit.topup'))
                        }
                    >
                        Top Up
                    </div>
                </div>
            </div>
            <div className="px-5 pb-5 border-b">
                <div className="flex flex-row items-center text-gray-600 text-sm">
                    <div>{user.display_poin} poin</div>
                    <div className="pl-1" onClick={() => setPopover(!popover)}>
                        <HiOutlineQuestionMarkCircle className="h-4 w-4" />

                        <div
                            className={`${
                                popover ? '' : 'invisible'
                            } absolute z-10 inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400`}
                        >
                            <div className="p-2 ">{user.poin_expired_text}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-row gap-2 px-5 py-5">
                    <Link
                        href={route('transactions.deposit.index')}
                        className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                            enable === 'deposit'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100'
                        }`}
                    >
                        Deposit
                    </Link>
                    <Link
                        href={route('transactions.sale.index')}
                        className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                            enable === 'trx'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100'
                        }`}
                    >
                        Pembelian
                    </Link>
                    <Link
                        href={route('transactions.poin.index')}
                        className={`px-3 py-1 rounded-full border hover:bg-blue-500  ${
                            enable === 'poin'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100'
                        }`}
                    >
                        Poin
                    </Link>
                </div>
            </div>
        </>
    )
}
