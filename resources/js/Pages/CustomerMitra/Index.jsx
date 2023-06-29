import React, { useEffect, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { Button, Dropdown } from 'flowbite-react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import { formatIDR, hasPermission } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import SearchInput from '@/Components/SearchInput'
import LocationSelectionInput from '../Location/SelectionInput'
import LevelSelectionInput from '../CustomerLevel/SelectionInput'
import ThSort from '@/Components/ThSortComponent'
import { HiEye } from 'react-icons/hi2'

export default function Customer(props) {
    const {
        query: { links, data },
        stats,
        auth,
        _search,
        _sortBy,
        _sortOrder,
    } = props

    const [location, setLocation] = useState(null)
    const [level, setLevel] = useState(null)
    const [search, setSearch] = useState({
        q: _search,
        sortBy: _sortBy,
        sortOrder: _sortOrder,
    })
    const preValue = usePrevious(`${search}${location}${level}`)

    const confirmModal = useModalState()

    const handleDeleteClick = (customer) => {
        confirmModal.setData(customer)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('mitra.destroy', confirmModal.data.id))
        }
    }

    const handleSearchChange = (e) => {
        setSearch({
            ...search,
            q: e.target.value,
        })
    }

    const sort = (key, sort = null) => {
        if (sort !== null) {
            setSearch({
                ...search,
                sortBy: key,
                sortRule: sort,
            })
            return
        }
        setSearch({
            ...search,
            sortBy: key,
            sortRule: search.sortRule == 'asc' ? 'desc' : 'asc',
        })
    }

    const params = { q: search, location_id: location, level_id: level }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { ...search, location_id: location, level_id: level },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search, location, level])

    const canCreate = hasPermission(auth, 'create-customer')
    const canUpdate = hasPermission(auth, 'update-customer')
    const canDelete = hasPermission(auth, 'delete-customer')

    return (
        <AuthenticatedLayout page={'Mitra WBB'} action={''}>
            <Head title="Mitra WBB" />

            <div className="w-full lg:max-w-[1100px] 2xl:max-w-full">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Mitra
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.total_mitra)} Orang
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Mitra diblock
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.blocked_mitra)} Orang
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Mitra Aktif
                            </div>
                            <div className="font-bold text-xl pt-2">
                                {formatIDR(stats.active_mitra)} Orang
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Limit Mitra
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_paylater_limit)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Hutang Mitra
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_paylater_usage)}
                            </div>
                        </div>
                        <div className="border rounded-md shadow bg-white px-4 py-2 flex flex-col">
                            <div className="text-gray-600 text-lg">
                                Total Sisa Limit Mitra
                            </div>
                            <div className="font-bold text-xl pt-2">
                                Rp. {formatIDR(stats.sum_paylater_remain)}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {canCreate && (
                                <Link href={route('mitra.create')}>
                                    <Button color="primary" size="sm">
                                        Tambah
                                    </Button>
                                </Link>
                            )}
                            <div className="flex flex-col gap-1 items-end">
                                <div className="max-w-md">
                                    <SearchInput
                                        onChange={handleSearchChange}
                                        value={search.q}
                                    />
                                </div>
                                <div className="flex flex-row gap-1">
                                    <div className="w-full max-w-md">
                                        <LevelSelectionInput
                                            itemSelected={level}
                                            onItemSelected={(id) =>
                                                setLevel(id)
                                            }
                                            placeholder={'filter level'}
                                            only={['gold', 'platinum']}
                                        />
                                    </div>
                                    <div className="w-full max-w-md">
                                        <LocationSelectionInput
                                            itemSelected={location}
                                            onItemSelected={(id) =>
                                                setLocation(id)
                                            }
                                            placeholder={'filter lokasi'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Level
                                            </th>
                                            <ThSort
                                                sort={sort}
                                                label={'deposit_balance'}
                                                search={search}
                                            >
                                                Deposit
                                            </ThSort>
                                            <ThSort
                                                sort={sort}
                                                label={'poin_balance'}
                                                search={search}
                                            >
                                                Poin
                                            </ThSort>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Sisa Saldo Hutang
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Limit Hutang
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Referral Code
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
                                                Whatsapp
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6 w-1/8"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((customer) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={customer.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline"
                                                >
                                                    <Link
                                                        href={route(
                                                            'mitra.edit',
                                                            customer
                                                        )}
                                                    >
                                                        {customer.name}
                                                    </Link>
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.level.name}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.display_deposit}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.display_poin}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {formatIDR(
                                                        customer.paylater_remain
                                                    )}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {formatIDR(
                                                        customer.paylater_limit
                                                    )}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.referral_code}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.location_favorites.map(
                                                        (location) => (
                                                            <div
                                                                key={
                                                                    location.id
                                                                }
                                                            >
                                                                {location.name}
                                                            </div>
                                                        )
                                                    )}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.phone !==
                                                        null && (
                                                        <a
                                                            href={`https://wa.me/+62${customer.phone}`}
                                                            target="_blank"
                                                            className="underline"
                                                        >
                                                            +62{customer.phone}
                                                        </a>
                                                    )}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6"
                                                >
                                                    {customer.status_text}
                                                </td>
                                                <td className="py-4 px-6 flex justify-end">
                                                    <Dropdown
                                                        color="primary"
                                                        label={'Opsi'}
                                                        floatingArrow={true}
                                                        arrowIcon={true}
                                                        dismissOnClick={true}
                                                        size={'sm'}
                                                    >
                                                        <Dropdown.Item>
                                                            <Link
                                                                href={route(
                                                                    'mitra.edit',
                                                                    customer
                                                                )}
                                                                className="flex space-x-1 items-center"
                                                            >
                                                                <HiEye />
                                                                <div>
                                                                    Transaksi
                                                                    Pembelian
                                                                </div>
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                href={route(
                                                                    'mitra.edit',
                                                                    customer
                                                                )}
                                                                className="flex space-x-1 items-center"
                                                            >
                                                                <HiEye />
                                                                <div>
                                                                    Riwayat
                                                                    Hutang
                                                                </div>
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                href={route(
                                                                    'mitra.edit',
                                                                    customer
                                                                )}
                                                                className="flex space-x-1 items-center"
                                                            >
                                                                <HiEye />
                                                                <div>
                                                                    Riwayat
                                                                    Topup limit
                                                                </div>
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                href={route(
                                                                    'mitra.edit',
                                                                    customer
                                                                )}
                                                                className="flex space-x-1 items-center"
                                                            >
                                                                <HiEye />
                                                                <div>
                                                                    Riwayat
                                                                    penambahan
                                                                    tenor
                                                                </div>
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                href={route(
                                                                    'mitra.edit',
                                                                    customer
                                                                )}
                                                                className="flex space-x-1 items-center"
                                                            >
                                                                <HiEye />
                                                                <div>
                                                                    Riwayat
                                                                    Topup
                                                                    Deposit
                                                                </div>
                                                            </Link>
                                                        </Dropdown.Item>
                                                        {canUpdate && (
                                                            <Dropdown.Item>
                                                                <Link
                                                                    href={route(
                                                                        'mitra.edit',
                                                                        customer
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
                                                                        customer
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
