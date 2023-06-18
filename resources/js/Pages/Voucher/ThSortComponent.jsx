import { HiArrowDown, HiArrowUp } from 'react-icons/hi2'

export default function ThSort({ sort, search, label, children }) {
    return (
        <th scope="col" className="py-3 px-6" onClick={() => sort(label)}>
            <div className="w-full flex flex-row  items-center gap-1">
                <div>{children}</div>
                {search.sortBy === label && search.sortRule === 'desc' && (
                    <div>
                        <HiArrowDown />
                    </div>
                )}
                {search.sortBy === label && search.sortRule === 'asc' && (
                    <div>
                        <HiArrowUp />
                    </div>
                )}
            </div>
        </th>
    )
}
