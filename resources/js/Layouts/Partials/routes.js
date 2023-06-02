import {
    HiChartPie,
    HiUser,
    HiUsers,
    HiUserGroup,
    HiInformationCircle,
    HiCog,
} from 'react-icons/hi'
import {
    HiBanknotes,
    HiMap,
    HiOutlineGlobeAlt,
    HiQuestionMarkCircle,
    HiUserCircle,
} from 'react-icons/hi2'

export default [
    {
        name: 'Dashboard',
        show: true,
        icon: HiChartPie,
        route: route('dashboard'),
        active: 'dashboard',
        permission: 'view-dashboard',
    },
    {
        name: 'Customer',
        show: true,
        icon: HiUserCircle,
        route: route('customer.index'),
        active: 'customer.*',
        permission: 'view-customer',
    },
    {
        name: 'Bank Akun',
        show: true,
        icon: HiBanknotes,
        route: route('account.index'),
        active: 'account.*',
        permission: 'view-account',
    },
    {
        name: 'Setting',
        show: true,
        icon: HiCog,
        route: route('setting.index'),
        active: 'setting.*',
        permission: 'view-setting',
    },
    {
        name: 'Lokasi',
        show: true,
        icon: HiMap,
        route: route('location.index'),
        active: 'location.*',
        permission: 'view-location',
    },
    {
        name: 'Front Home',
        show: true,
        icon: HiOutlineGlobeAlt,
        items: [
            {
                name: 'Banner',
                show: true,
                icon: HiInformationCircle,
                route: route('banner.index'),
                active: 'banner.*',
                permission: 'view-banner',
            },
            {
                name: 'Info',
                show: true,
                icon: HiQuestionMarkCircle,
                route: route('info.index'),
                active: 'info.index',
                permission: 'view-info',
            },
        ],
    },
    {
        name: 'User',
        show: true,
        icon: HiUser,
        items: [
            {
                name: 'Roles',
                show: true,
                icon: HiUserGroup,
                route: route('roles.index'),
                active: 'roles.*',
                permission: 'view-role',
            },
            {
                name: 'Users',
                show: true,
                icon: HiUsers,
                route: route('user.index'),
                active: 'user.index',
                permission: 'view-user',
            },
        ],
    },
]
