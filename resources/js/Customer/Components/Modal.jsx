export default function Modal({ isOpen, children }) {
    return (
        <div
            className={`${
                isOpen ? '' : 'hidden '
            } overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-50 w-full h-full justify-center flex bg-opacity-50 dark:bg-opacity-90 bg-gray-900 dark:bg-gray-900 delay-150 transition ease-in-out duration-1000`}
        >
            <div className={`relative w-full max-w-md h-full md:h-auto`}>
                <div className="relative bg-white h-full p-2 dark:bg-gray-700 text-base dark:text-gray-400">
                    {children}
                </div>
            </div>
        </div>
    )
}
