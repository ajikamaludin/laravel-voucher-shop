import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Index({
    auth: { user },
    coins: { data, next_page_url },
}) {
    const [_coins, setCoins] = useState(data)

    const handleNextPage = () => {
        router.get(
            next_page_url,
            {},
            {
                replace: true,
                preserveState: true,
                only: ['coins'],
                onSuccess: (res) => {
                    setCoins(_coins.concat(res.props.coins.data))
                },
            }
        )
    }

    return (
        <CustomerLayout>
            <Head title="Coin" />
            <div className="flex flex-col w-full min-h-[calc(90dvh)]">
                <div className="w-full pt-10 px-5">
                    <div className="text-base">{user.fullname}</div>
                </div>
                <div className="flex flex-row justify-between items-center pb-10 border-b px-5">
                    <div>
                        <div className="font-semibold text-xl text-gray-400">
                            Coin
                        </div>
                        <div className="font-bold text-3xl">
                            {user.display_coin}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col py-10 space-y-5 px-5">
                        {_coins.map((coin) => (
                            <div
                                key={coin.id}
                                className="flex flex-row pb-2 items-center justify-between border-b"
                                onClick={() =>
                                    router.get(
                                        route('customer.coin.show', coin.id)
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="font-bold">
                                        {coin.format_human_created_at}
                                    </div>
                                    <div className="font-thin">
                                        {coin.description}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-lg">
                                        {coin.amount}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {next_page_url !== null && (
                            <div
                                onClick={handleNextPage}
                                className="w-full text-center px-2 py-1 border mt-5 hover:bg-blue-600 hover:text-white"
                            >
                                Load more
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
