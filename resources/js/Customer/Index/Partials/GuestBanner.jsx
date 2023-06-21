import { usePage } from '@inertiajs/react'
import { HiOutlineBell } from 'react-icons/hi2'

export default function GuestBanner() {
    const {
        props: { setting, notification_count },
    } = usePage()
    return (
        <div>
            {/* user */}
            <div className="flex flex-row justify-between items-center px-5 py-6 text-lg bg-blue-900">
                <div className="flex flex-col text-white">
                    <div className="font-bold">{setting.OPEN_WEBSITE_NAME}</div>
                </div>
                <div className="flex flex-row">
                    <HiOutlineBell className="text-white w-7 h-7" />
                    <div>
                        <div className="bg-white text-blue-700 rounded-lg px-1 text-xs -ml-2.5">
                            {notification_count}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
