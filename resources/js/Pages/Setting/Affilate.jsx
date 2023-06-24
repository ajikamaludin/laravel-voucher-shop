import React from 'react'
import { Head, useForm } from '@inertiajs/react'

import { extractValue } from './utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import FormFile from '@/Components/FormFile'
import Checkbox from '@/Components/Checkbox'
import FormInputNumeric from '@/Components/FormInputNumeric'
import TextArea from '@/Components/TextArea'
import LevelSelectionInput from '../CustomerLevel/SelectionInput'

export default function Affilate(props) {
    const { setting, levels } = props
    const { data, setData, post, reset, processing, errors } = useForm({
        AFFILATE_ENABLED: extractValue(setting, 'AFFILATE_ENABLED'),
        AFFILATE_POIN_AMOUNT: extractValue(setting, 'AFFILATE_POIN_AMOUNT'),
        AFFILATE_DOWNLINE_POIN_AMOUNT: extractValue(
            setting,
            'AFFILATE_DOWNLINE_POIN_AMOUNT'
        ),
        AFFILATE_SHARE_REFFERAL_CODE: extractValue(
            setting,
            'AFFILATE_SHARE_REFFERAL_CODE'
        ),
        AFFILATE_ALLOWED_LEVELS: JSON.parse(
            extractValue(setting, 'AFFILATE_ALLOWED_LEVELS')
        ),
    })

    const handleCheckLevel = (e, level) => {
        if (e.target.checked) {
            const isExists = data.AFFILATE_ALLOWED_LEVELS.find(
                (l) => l.id === level.id
            )
            if (isExists) {
                return
            }
            setData(
                'AFFILATE_ALLOWED_LEVELS',
                data.AFFILATE_ALLOWED_LEVELS.concat(level)
            )
        } else {
            setData(
                'AFFILATE_ALLOWED_LEVELS',
                data.AFFILATE_ALLOWED_LEVELS.filter((l) => l.id !== level.id)
            )
        }
    }

    const isCheck = (level) => {
        const isExists = data.AFFILATE_ALLOWED_LEVELS.find(
            (l) => l.id === level.id
        )
        if (isExists) {
            return true
        }
        return false
    }

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const handleSubmit = () => {
        post(route('setting.affilate'))
    }

    return (
        <AuthenticatedLayout
            page={'Affilate'}
            action={''}
            parent={route(route().current())}
        >
            <Head title="Affilate" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col min-h-screen">
                        <div className="mt-2 p-2 border rounded-xl">
                            <div className="font-bold mb-2">Affilate</div>
                            <FormInputNumeric
                                name="AFFILATE_POIN_AMOUNT"
                                value={data.AFFILATE_POIN_AMOUNT}
                                onChange={handleOnChange}
                                label="Poin Affiliasi"
                                error={errors.AFFILATE_POIN_AMOUNT}
                            />
                            <FormInputNumeric
                                name="AFFILATE_DOWNLINE_POIN_AMOUNT"
                                value={data.AFFILATE_DOWNLINE_POIN_AMOUNT}
                                onChange={handleOnChange}
                                label="Poin Transaksi Affiliasi (Downline)"
                                error={errors.AFFILATE_DOWNLINE_POIN_AMOUNT}
                            />
                            <TextArea
                                name="AFFILATE_SHARE_REFFERAL_CODE"
                                value={data.AFFILATE_SHARE_REFFERAL_CODE}
                                onChange={handleOnChange}
                                label="Text Sharelink Affilate"
                                error={errors.AFFILATE_SHARE_REFFERAL_CODE}
                            />
                            <Checkbox
                                label="Enable"
                                value={+data.AFFILATE_ENABLED === 1}
                                onChange={handleOnChange}
                                name="AFFILATE_ENABLED"
                            />
                            <div className="mt-2">Level Affilate</div>
                            <div className="border p-1 rounded">
                                {levels.map((level) => (
                                    <Checkbox
                                        key={level.id}
                                        label={level.name}
                                        value={isCheck(level)}
                                        onChange={(e) =>
                                            handleCheckLevel(e, level)
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button
                                onClick={handleSubmit}
                                processing={processing}
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
