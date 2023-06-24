import toast from 'react-hot-toast'

export const toastSuccess = (message) => {
    toast.success((t) => {
        return <div onClick={() => toast.dismiss(t.id)}>{message}</div>
    })
}
