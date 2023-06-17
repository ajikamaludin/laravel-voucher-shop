import React from 'react'
import { Link, router } from '@inertiajs/react'
import { Sidebar } from 'flowbite-react'
import { HiLogout } from 'react-icons/hi'
import { filterOpenMenu } from './helpers'
import routes from './routes'

const Item = ({ item, children }) => {
    const Icon = () =>
        item.icon({
            className:
                'w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        })
    const isActive = route().current(item.active)
    const className = `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive && 'bg-gray-200'
    }`

    return (
        <Link href={item.route} className={className}>
            <Icon />
            <span className="ml-3">{children}</span>
        </Link>
    )
}

const SubItem = ({ item, children }) => {
    const Icon = () =>
        item.icon({
            className:
                'w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        })
    const isActive = route().current(item.active)
    const className = `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
        isActive && 'bg-gray-200'
    }`

    return (
        <Link href={item.route} className={className}>
            <Icon />
            <span className="ml-3">{children}</span>
        </Link>
    )
}

export default function SidebarNav({ user }) {
    const menus = routes.filter((item) => {
        item.open = false
        if (!item.show) {
            return null
        }
        if (user.role === null) {
            return filterOpenMenu(user, item)
        }
        if (user.role.permissions.find((p) => p.name === item.permission)) {
            return item
        }

        return filterOpenMenu(user, item)
    })

    return (
        <Sidebar aria-label="Sidebar with multi-level dropdown example">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {menus.map((item) => (
                        <div key={item.name}>
                            {item.items === undefined ? (
                                <Item item={item}>{item.name}</Item>
                            ) : (
                                <Sidebar.Collapse
                                    icon={item.icon}
                                    label={item.name}
                                    open={item.open}
                                >
                                    {item.items.map((item) => (
                                        <SubItem item={item} key={item.name}>
                                            {item.name}
                                        </SubItem>
                                    ))}
                                </Sidebar.Collapse>
                            )}
                        </div>
                    ))}
                    <Sidebar.Item
                        onClick={() => router.post(route('logout'))}
                        icon={HiLogout}
                    >
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 text-center bottom-4 left-4 pt-10">
                    Elsoft &copy; {new Date().getFullYear()}
                </p>
            </Sidebar.Items>
        </Sidebar>
    )
}
