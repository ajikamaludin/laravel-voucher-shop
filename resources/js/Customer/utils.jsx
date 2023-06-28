import {
    PAYED_WITH_DEPOSIT,
    PAYED_WITH_PAYLATER,
    PAYED_WITH_POIN,
} from '@/constant'
import toast from 'react-hot-toast'

export const toastSuccess = (message) => {
    toast.success((t) => {
        return <div onClick={() => toast.dismiss(t.id)}>{message}</div>
    })
}

export const toastError = (message) => {
    toast.error((t) => {
        return <div onClick={() => toast.dismiss(t.id)}>{message}</div>
    })
}

export const convertPayedWith = (payed_with) => {
    const payedWith = [
        {
            key: PAYED_WITH_PAYLATER,
            value: 'pembayaran: saldo hutang',
        },
        { key: PAYED_WITH_POIN, value: 'penukaran poin' },
        { key: PAYED_WITH_DEPOSIT, value: 'pembayaran saldo deposit' },
    ]

    return payedWith.find((p) => p.key === payed_with).value
}

export const CASH_DEPOSIT = 'CASH_DEPOSIT'
