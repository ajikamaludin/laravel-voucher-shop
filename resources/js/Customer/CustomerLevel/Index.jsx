import React, { useState } from 'react'
import Carousel from 'nuka-carousel'
import { Head, router } from '@inertiajs/react'
import { HiChevronLeft } from 'react-icons/hi2'

import CustomerLayout from '@/Layouts/CustomerLayout'

export default function Index(props) {
    const {
        levels,
        auth: { user },
    } = props

    const levelIndex = levels.findIndex((l) => l.id === user.level.id)
    const [selectedIndex] = useState(levelIndex)
    const [index, setIndex] = useState(selectedIndex)

    return (
        <CustomerLayout>
            <Head title="Reward Member" />
            <div className="flex flex-col min-h-[calc(90dvh)]">
                <div
                    className="w-full px-5 py-5"
                    onClick={() => {
                        router.get(route('home.index', { direct: 1 }))
                    }}
                >
                    <HiChevronLeft className="font-bold h-5 w-5" />
                </div>
                <div className="w-full px-2">
                    <Carousel
                        autoplay={false}
                        withoutControls={true}
                        wrapAround={false}
                        cellSpacing={10}
                        slideIndex={selectedIndex}
                        slidesToShow={1.1}
                        afterSlide={(index) => {
                            setIndex(index)
                        }}
                    >
                        {levels.map((level, index) => (
                            <div key={level.id} className="flex flex-col h-40">
                                <div className="h-36 rounded-lg border p-2 flex flex-row gap-2 items-center shadow-lg">
                                    <div>
                                        <img src={level.logo_url} />
                                    </div>
                                    <div className=" flex-1 flex flex-col">
                                        <div className="text-2xl font-bold">
                                            {level.name}
                                        </div>
                                        {levelIndex === index && (
                                            <div className="text-gray-400 text-sm">
                                                Level kamu saat ini
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                    {/*  */}
                    <Carousel
                        autoplay={false}
                        withoutControls={true}
                        wrapAround={true}
                        dragging={false}
                        swiping={false}
                        cellSpacing={10}
                        slideIndex={index}
                        slidesToShow={1}
                    >
                        {levels.map((level) => (
                            <div key={level.id} className="flex flex-col mt-4">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: level.description,
                                    }}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </CustomerLayout>
    )
}
