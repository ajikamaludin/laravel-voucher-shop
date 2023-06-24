import { usePage, router, Link } from '@inertiajs/react'

export default function HeaderTrx({ enable = 'deposit' }) {
    const {
        props: {
            auth: { user },
        },
    } = usePage()
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
                    <div className="pl-1 text-xs">
                        ( kadaluarsa pada 20 juni 2023 )
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-row gap-2 px-5 py-5">
                    <Link
                        href={route('transactions.deposit.index')}
                        className={`px-3 py-1 rounded-full border ${
                            enable === 'deposit'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100'
                        }`}
                    >
                        Deposit
                    </Link>
                    <Link
                        href={route('transactions.sale.index')}
                        className={`px-3 py-1 rounded-full border ${
                            enable === 'trx'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100'
                        }`}
                    >
                        Pembelian
                    </Link>
                    <Link
                        href={route('transactions.poin.index')}
                        className={`px-3 py-1 rounded-full border ${
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
