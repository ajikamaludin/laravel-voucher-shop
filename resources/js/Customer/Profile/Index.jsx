import React from 'react'
import { Head, router } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { HiOutlineBell } from 'react-icons/hi'
import {
    HiChevronRight,
    HiClipboardDocumentList,
    HiOutlineUserCircle,
} from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'
import { useModalState } from '@/hooks'
import ModalConfirm from '@/Components/ModalConfirm'
import BalanceBanner from '../Index/BalanceBanner'

export default function Index({ auth: { user } }) {
    const confirmModal = useModalState()

    const handleLogoutClick = () => {
        confirmModal.toggle()
    }

    const onLogout = () => {
        router.post(route('customer.logout'))
    }

    const handleCopyToClipboard = (text) => {
        toast.info('copied to clipboard')
        navigator.clipboard.writeText(text)
    }

    return (
        <CustomerLayout>
            <Head title="Profile" />
            <div className="flex flex-col min-h-[calc(95dvh)]">
                <div>
                    {/* user */}
                    <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-600">
                        <div className="flex flex-row items-center space-x-2">
                            {user.image_url !== null ? (
                                <img
                                    src={user.image_url}
                                    alt="profile image"
                                    className="rounded-full object-cover h-14 w-14"
                                />
                            ) : (
                                <HiOutlineUserCircle className="text-white h-14 w-14" />
                            )}
                            <div className="flex flex-col text-white">
                                <div className="font-bold">{user.name}</div>
                                <div className="flex flex-row items-center space-x-1">
                                    <div>{user.display_phone}</div>
                                    <div className="text-xs font-semibold px-2 py-1 bg-white text-black rounded-xl">
                                        {user.level.name}
                                    </div>
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
                    <BalanceBanner user={user} />
                </div>
                <div className="p-4 pb-0">
                    <div
                        className="p-4 text-blue-800 rounded-lg bg-blue-50 flex flex-row space-x-2 w-full items-center"
                        role="alert"
                        onClick={() =>
                            handleCopyToClipboard(user.referral_code)
                        }
                    >
                        <div>Referral Code: </div>
                        <div className="font-bold">{user.referral_code}</div>
                        <div>
                            <HiClipboardDocumentList className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col">
                    <div className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100">
                        <div>Upgrade Member</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div
                        className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100"
                        onClick={() =>
                            router.get(route('customer.deposit.index'))
                        }
                    >
                        <div>Deposit Saldo</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div
                        className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100"
                        onClick={() => router.get(route('customer.coin.index'))}
                    >
                        <div>Coin</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div
                        className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100"
                        onClick={() => router.get(route('transactions.index'))}
                    >
                        <div>Transaksi</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100">
                        <div>Notifikasi</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div
                        className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 hover:bg-gray-100"
                        onClick={() =>
                            router.get(route('customer.profile.show'))
                        }
                    >
                        <div>Profile</div>
                        <HiChevronRight className="h-5 w-5" />
                    </div>
                    <div
                        onClick={() => handleLogoutClick()}
                        className="flex flex-row justify-between items-center px-2 py-4 w-full border-b border-gray-400 text-red-700 hover:bg-gray-100"
                    >
                        Logout
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onLogout} />
        </CustomerLayout>
    )
}