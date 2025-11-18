
'use client';
import { filterList } from '@/lib/constants';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react';

const Filters = ({ isFilterOpen, setIsFilterOpen }: { isFilterOpen: boolean; setIsFilterOpen: (open: boolean) => void; }) => {
    // Get search params on client side
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
        'Gender': false,
        'Color': false,
        'Size': false,
        'Price Range': false,
    });

    const handleFilterChange = (filterTitle: string, option: string) => {
        const params = new URLSearchParams(searchParams.toString());

        const existingValues = params.getAll(filterTitle.toLowerCase());

        if (existingValues.includes(option)) {
            // If the option is already selected, remove it
            const newValues = existingValues.filter(value => value !== option);
            params.delete(filterTitle.toLowerCase());
            // Re-add the remaining values
            newValues.forEach(value => params.append(filterTitle.toLowerCase(), value));
        } else {
            params.append(filterTitle.toLowerCase(), option);
        }

        const newSearch = params.toString();
        const newPath = newSearch ? `${pathName}?${newSearch}` : pathName;
        router.push(newPath);
    }

    const handleClearFilters = () => {
        router.push(pathName || '/');
    };

    return (
        <section className='flex flex-col p-6 md:px-0 sm:z-0' aria-labelledby="filter">
            <div className="flex md:hidden justify-between items-center mb-6">
                <h2 id="filter" className='text-body text-dark-800'>Filters</h2>
                <button className='p-3 rounded-full bg-light-200 hover:bg-light-300 hover:cursor-pointer' onClick={() => setIsFilterOpen(false)}><Image src="/x-lg.svg" alt="Close" width={24} height={24} /></button>
            </div>
            <div className='mb-6 z-0' >
                {
                    filterList.map((filter) => {
                        const key = filter.title.toLowerCase();
                        const selectedOptions = searchParams.getAll(key);
                        const filterCount = selectedOptions.length;
                        const expand = Boolean(isExpanded[filter.title]) || filterCount > 0;

                        return (
                            <div key={filter.title}>
                                <div className='hidden md:flex justify-between items-center hover:cursor-pointer' onClick={() => setIsExpanded((prev) => ({
                                    ...prev, [filter.title]: !prev[filter.title]
                                }))
                                }>
                                    <h3 className='text-heading-4 text-dark-800'>{filter.title} {filterCount > 0 ? <span>({filterCount})</span> : null}</h3>
                                    <Image src="chevron-down.svg" width={16} height={16} alt="Expand" className={`group-active:rotate-180 transition-transform duration-200 ${expand ? 'rotate-180' : ''}`} />
                                </div>

                                <div className='md:hidden'>
                                    <h3 className='text-heading-4 text-dark-800'>{filter.title} {filterCount > 0 ? <span>({filterCount})</span> : null}</h3>
                                </div>

                                <ul className={`pl-2 overflow-hidden pt-2 transition-all duration-300 ${expand ? 'md:max-h-96' : 'md:max-h-0'}`}>
                                    {filter.options.map((option) => {
                                        const keyOption = option.toLowerCase();
                                        const isSelected = selectedOptions.includes(keyOption);
                                        return (
                                            <li key={option} className='mb-1 mt-2 hover:text-dark-700'>
                                                <label className='flex items-center'>
                                                    <input type="checkbox" className='mr-2' onChange={() => handleFilterChange(filter.title, keyOption)} checked={isSelected} />
                                                    {option}
                                                </label>
                                            </li>
                                        )
                                    })}
                                </ul>
                                <div className='border-t border-light-300 my-4' />
                            </div>
                        )
                    }
                    )
                }
                <button className='mt-4 text-sm text-dark-600 hover:underline hover:text-dark-700 hover:cursor-pointer' onClick={handleClearFilters}>Clear All</button>
            </div>
        </section>
    )
}

export default Filters