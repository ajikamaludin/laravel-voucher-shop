import {
    HiChartPie,
    HiUser,
    HiUsers,
    HiUserGroup,
    HiInformationCircle,
} from 'react-icons/hi'
import { HiQuestionMarkCircle } from 'react-icons/hi2'

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
