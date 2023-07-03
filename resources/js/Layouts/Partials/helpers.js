import { router } from '@inertiajs/react'

export const filterOpenMenu = (user, item) => {
    const isAdmin = user.role === null
    if ('items' in item) {
        let items = []
        if (isAdmin) {
            items = item.items
        } else {
            items = item.items.filter((item) =>
                user.role.permissions.find((p) => p.name === item.permission)
                    ? item
                    : null
            )
        }

        if (items.length > 0) {
            let activeItem = items.map((item) => route().current(item.active))
            item.open = activeItem.includes(true)
            item.items = items.filter((item) => (item.show ? item : null))
            return item
        }
    }
    if (isAdmin) {
        return item
    }
}

export const browserNotification = (title, message, url) => {
    if (typeof Notification !== undefined) {
        let permission = Notification.permission
        if (permission === 'granted') {
            let notification = new Notification(title, {
                body: message,
            })

            notification.onclick = () => {
                window.parent.focus()
                router.visit(url)
            }
        }
    }
}
