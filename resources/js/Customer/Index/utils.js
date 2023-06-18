import { router } from '@inertiajs/react'

export const ALL = 0
export const FAVORITE = 1

export const handleBanner = (banner) => {
    router.get(route('home.banner', banner))
}

export const isFavorite = (user, id) => {
    if (user === null) {
        return false
    }
    const isExists = user.location_favorites.findIndex((f) => f.id === id)
    if (isExists !== -1) {
        return true
    }
    return false
}
