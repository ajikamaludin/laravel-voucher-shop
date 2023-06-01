import React from 'react'
import { HiOutlineCash, HiOutlineBell } from 'react-icons/hi'

export default function UserBanner({ user }) {
    return (
        <div>
            {/* user */}
            <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                <div className="flex flex-col text-white">
                    <div className="font-bold">{user.name}</div>
                    <div className="flex flex-row items-center space-x-1">
                        <div>+62{user.phone}</div>
                        <div className="text-xs font-semibold px-2 py-1 bg-white text-black rounded-xl">
                            {user.level.name}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <HiOutlineBell className="text-white w-7 h-7" />
                    <div>
                        <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                            1
                        </div>
                    </div>
                </div>
            </div>
            {/* saldo */}
            <div className="flex flex-row px-5 pb-3 text-base bg-blue-600">
                <div className="flex flex-row w-full shadow py-2 px-2 rounded bg-white items-center justify-between">
                    <div className="flex flex-col">
                        <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                            <HiOutlineCash />
                            <div>Saldo</div>
                        </div>
                        <div className="font-bold">
                            Rp {user.display_deposit}
                        </div>
                        <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                            <div>Coin {user.display_coin}</div>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 pl-5 pr-5">
                        <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                            {/* <HiOutlineAwa /> */}
                            <div>Rewards</div>
                        </div>
                        <div className="font-bold">
                            {user.level.name} Member
                        </div>
                        <div className="text-xs flex flex-row items-center space-x-1 text-gray-400">
                            <div>Limit 100.000</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
