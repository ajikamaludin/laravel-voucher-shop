export default function BottomSheet({ isOpen, toggle, children }) {
    return (
        <>
            <div
                className={`${
                    isOpen ? '' : 'hidden'
                } overflow-y-auto overflow-x-hidden fixed bottom-0 right-0 z-50 w-full justify-center flex delay-150 transition ease-in-out duration-1000`}
            >
                <div
                    className="fixed bottom-0 right-0 bg-opacity-50 dark:bg-opacity-90 bg-gray-900 w-full h-full dark:bg-gray-900"
                    onClick={() => toggle()}
                ></div>
                <div
                    className={`fixex bottom-0 relative w-full max-w-md md:h-auto`}
                >
                    <div className="relative bg-white rounded-t-lg p-2 dark:bg-gray-700 text-base dark:text-gray-400">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
