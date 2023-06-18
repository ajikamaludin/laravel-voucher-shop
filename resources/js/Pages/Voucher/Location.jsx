import React, { useEffect, useState } from 'react'
import { router, Link } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { Button } from 'flowbite-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'
import { hasPermission } from '@/utils'

export default function Index(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(`${search}`)

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

    return (
        <AuthenticatedLayout page={'Voucher'} action={''}>
            <Head title="Voucher" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
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
                            <div className="flex flex-col md:flex-row gap-1 items-center">
                                <div className="w-full max-w-md">
                                    <SearchInput
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        value={search}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                                {data.map((location) => (
                                    <Link
                                        key={location.name}
                                        href={route(
                                            'voucher.profile',
                                            location
                                        )}
                                        className="px-4 py-6 bg-white flex flex-col md:flex-row justify-between items-center rounded-md shadow border hover:bg-gray-100"
                                    >
                                        <div className="text-xl font-bold hover:underline">
                                            {location.name}
                                        </div>
                                        <div
                                            className={`${location.count_vouchers.color} px-2 rounded border`}
                                        >
                                            {
                                                location.count_vouchers
                                                    .unsold_count
                                            }
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
