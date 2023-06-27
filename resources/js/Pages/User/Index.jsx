import React, { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import { Head, Link, router } from '@inertiajs/react'
import { Button, Dropdown } from 'flowbite-react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import SearchInput from '@/Components/SearchInput'
import { hasPermission } from '@/utils'

export default function User(props) {
    const {
        data: { links, data },
        auth,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const confirmModal = useModalState()

    const handleDeleteClick = (user) => {
        confirmModal.setData(user)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('user.destroy', confirmModal.data.id))
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

    const canCreate = hasPermission(auth, 'create-user')
    const canUpdate = hasPermission(auth, 'update-user')
    const canDelete = hasPermission(auth, 'delete-user')

    return (
        <AuthenticatedLayout page={'Admin'} action={'List'}>
            <Head title="Admin" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {canCreate && (
                                <Link href={route('user.create')}>
                                    <Button size="sm">Tambah</Button>
                                </Link>
                            )}
                            <div className="flex items-center">
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
                                                className="py-3 px-6 w-24"
                                            >
                                                Photo
                                            </th>
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
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Username
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Rule
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
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((user) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={user.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    <img
                                                        src={user.photo_url}
                                                        alt="photo profile"
                                                        loading="lazy"
                                                        className="w-20 h-20 rounded-full"
                                                    />
                                                </td>
                                                <td className="py-4 px-6">
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {user.email}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {user.username}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {user.role === null
                                                        ? 'System'
                                                        : user.role?.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <a
                                                        href={`https://wa.me/+62${user.phone_wa}`}
                                                        target="_blank"
                                                        className="underline"
                                                    >
                                                        +62{user.phone_wa}
                                                    </a>
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
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            'user.edit',
                                                                            user
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex space-x-1 items-center">
                                                                    <HiPencil />
                                                                    <div>
                                                                        Ubah
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                        )}
                                                        {canDelete && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        user
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
