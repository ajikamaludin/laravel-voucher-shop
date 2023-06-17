import React, { useEffect, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { Button, Dropdown } from 'flowbite-react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import { hasPermission, formatIDR } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import SearchInput from '@/Components/SearchInput'

export default function Index(props) {
    const {
        query: { links, data },
        auth,
        location,
        profile,
        stats,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(`${search}`)

    const confirmModal = useModalState()

    const handleDeleteClick = (voucher) => {
        confirmModal.setData(voucher)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('voucher.destroy', confirmModal.data.id))
        }
    }

    const params = { q: search }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    const canCreate = hasPermission(auth, 'create-voucher')
    const canUpdate = hasPermission(auth, 'update-voucher')
    const canDelete = hasPermission(auth, 'delete-voucher')

    return (
        <AuthenticatedLayout
            page={'Voucher'}
            action={[location.name, profile.name]}
            parent={route('voucher.profile', location)}
        >
            <Head title="Voucher" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Voucher
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.count_voucher_total)} PCS
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Voucher
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_voucher_total)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Voucher sudah terjual
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.count_voucher_sold)} PCS
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Jumlah Voucher sudah terjual
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_voucher_sold)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Voucher belum terjual
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.count_voucher_unsold)} PCS
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Jumlah Voucher belum terjual
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_voucher_unsold)}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {canCreate && (
                                <div className="flex flex-row space-x-2">
                                    <Link href={route('voucher.create')}>
                                        <Button size="sm">Tambah</Button>
                                    </Link>
                                    <Link href={route('voucher.import')}>
                                        <Button size="sm" outline>
                                            Import
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            <div className="flex flex-row space-x-2 items-center">
                                <SearchInput
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                No
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Lokasi
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Kode
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Profile
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Kuota
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Comment
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Created At
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Terjual
                                            </th>

                                            <th
                                                scope="col"
                                                className="py-3 px-6 w-1/8"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((voucher, index) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={voucher.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {
                                                        voucher.profile.location
                                                            .name
                                                    }
                                                </td>

                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {voucher.username}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {voucher.profile.name}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {voucher.profile.quota}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {voucher.comment}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {
                                                        voucher.created_at_formated
                                                    }
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    <div
                                                        className={`p-2 border font-bold ${voucher.status.color}`}
                                                    >
                                                        {voucher.status.text}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 flex justify-end">
                                                    <Dropdown
                                                        label={'Opsi'}
                                                        floatingArrow={true}
                                                        arrowIcon={true}
                                                        dismissOnClick={true}
                                                        size={'sm'}
                                                    >
                                                        {canUpdate && (
                                                            <Dropdown.Item>
                                                                <Link
                                                                    href={route(
                                                                        'voucher.edit',
                                                                        voucher
                                                                    )}
                                                                    className="flex space-x-1 items-center"
                                                                >
                                                                    <HiPencil />
                                                                    <div>
                                                                        Ubah
                                                                    </div>
                                                                </Link>
                                                            </Dropdown.Item>
                                                        )}
                                                        {canDelete && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        voucher
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex space-x-1 items-center">
                                                                    <HiTrash />
                                                                    <div>
                                                                        Hapus
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
        </AuthenticatedLayout>
    )
}
