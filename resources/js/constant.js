export const DEFAULT_EXPIRED_UNIT = 'Hari'

export const STATUS_APPROVE = 0

export const STATUS_WAIT_UPLOAD = 1

export const STATUS_WAIT_APPROVE = 2

export const STATUS_WAIT_PAYMENT = 3

export const STATUS_INVALID = 4

export const STATUS_REJECT = 5

export const STATUS_EXPIRED = 6

export const PAYMENT_MANUAL = 'MANUAL'

export const PAYMENT_MIDTRANS = 'MIDTRANS'

export const PAYMENT_CASH_DEPOSIT = 'CASH_DEPOSIT'

export const PAYED_WITH_MIDTRANS = 'midtrans'

export const PAYED_WITH_MANUAL = 'manual'

export const PAYED_WITH_DEPOSIT = 'deposit'

export const PAYED_WITH_PAYLATER = 'paylater'

export const PAYED_WITH_POIN = 'poin'

export const STATUS_SUSPEND = 2

export const DEPOSIT_STATUSES = [
    { key: 'Success', value: STATUS_APPROVE },
    { key: 'Upload bukti bayar', value: STATUS_WAIT_UPLOAD },
    { key: 'Menunggu Approve', value: STATUS_WAIT_APPROVE },
    { key: 'Menunggu Pembayaran', value: STATUS_WAIT_PAYMENT },
    { key: 'Error', value: STATUS_INVALID },
    { key: 'Reject', value: STATUS_REJECT },
    { key: 'Expired', value: STATUS_EXPIRED },
]
export const BASIC = 'basic'

export const SILVER = 'silver'

export const GOLD = 'gold'

export const PLATINUM = 'platinum'

export const MUST_VERIFIED = [GOLD, PLATINUM]
