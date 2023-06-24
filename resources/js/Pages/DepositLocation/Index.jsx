import React from 'react'
import { Link, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { Button, Dropdown } from 'flowbite-react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import { hasPermission } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'

export default function DespositLocation(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const confirmModal = useModalState()

    const handleDeleteClick = (location) => {
        confirmModal.setData(location)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(
                route('deposit-location.destroy', confirmModal.data.id)
            )
        }
    }

    const canCreate = hasPermission(auth, 'create-deposit-location')
    const canUpdate = hasPermission(auth, 'update-deposit-location')
    const canDelete = hasPermission(auth, 'delete-deposit-location')

    return (
        <AuthenticatedLayout page={'Lokasi Deposit'} action={''}>
            <Head title="Lokasi Deposit" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {canCreate && (
                                <Link href={route('deposit-location.create')}>
                                    <Button size="sm">Tambah</Button>
                                </Link>
                            )}
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
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Alamat
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
                                                Jam Operasional
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Aktif
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((location) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={location.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {location.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {location.address}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <a
                                                        href={`https://wa.me/+62${location.phone}`}
                                                    >
                                                        +62{location.phone}
                                                    </a>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {location.operational_hour}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {+location.is_active === 1
                                                        ? 'Yes'
                                                        : 'No'}
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
                                                                        'deposit-location.edit',
                                                                        location
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
                                                                        location
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
                                <Pagination links={links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
        </AuthenticatedLayout>
    )
}
