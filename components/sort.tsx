'use client'
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low-High' },
    { value: 'price-desc', label: 'Price: High-Low' },
];

const Sort = ({ isFilterOpen, setIsFilterOpen }: { isFilterOpen: boolean; setIsFilterOpen: (isOpen: boolean) => void; }) => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const sortParam = searchParams.get('sort');

    // Memoize the selected option based on the sortParam
    const selectedOption = useMemo(() => {
        return OPTIONS.find(option => option.value === (sortParam || 'default')) || OPTIONS[0];
    }, [sortParam]);

    const handleHideFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsFilterOpen(!isFilterOpen);
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        // Create a new URLSearchParams object to manipulate query parameters
        const params = new URLSearchParams(searchParams.toString());

        // Update the sort parameter based on the selected value
        if (selectedValue === 'featured') {
            params.delete('sort');
        } else {
            params.set('sort', selectedValue);
        }

        // Construct the new URL with updated query parameters
        const newSearch = params.toString();
        const newPath = newSearch ? `${pathName}?${newSearch}` : pathName;

        router.push(newPath);
    }

    return (
        <div className='items-start'>
            <div className="hidden md:flex">
                <button className='mr-4 flex flex-row hover:cursor-pointer' onClick={handleHideFilters} aria-expanded={isFilterOpen}>
                    <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
                    <Image src="filter.svg" alt="filter" width={20} height={20} className='ml-2' />
                </button>

                <div className="group">
                    <label htmlFor="sort">Sort By: </label>
                    <select id="sort" className='focus:outline-none p-1 text-dark-700 group-hover:cursor-pointer' defaultValue="default" onChange={handleSortChange}>
                        {OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="text-dark-700">{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="md:hidden flex flex-row hover:cursor-pointer border-2 border-light-400 hover:border-black rounded-full px-3 py-1" onClick={handleHideFilters}>
                <span>Filter </span>
                <Image src="filter.svg" alt="filter" width={20} height={20} className='ml-2' />
            </button>
        </div>
    )
}

export default Sort