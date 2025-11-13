'use client';

import { useEffect, useState, useRef } from 'react';
import Sort from '@/components/sort';
import Filters from '@/components/filters';
import Card from '@/components/card';
// import { handleScrollDown } from './navbar';

export default function ProductsClient({ products, totalCount, }: { products: Product[]; totalCount: number;}) {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
    const prevScrollY = useRef<number>(0);
    const currentScrollY = useRef<number>(0);

    useEffect(() => {
        const handleScrollDown = () => {
            currentScrollY.current = window.pageYOffset;
            // Scroll down
            if (currentScrollY.current > prevScrollY.current || currentScrollY.current <= 50) {
                document.getElementById("products-header")?.style.setProperty("transform", "translateY(0)");
            } else {
                // Scroll up - move the element down
                document.getElementById("products-header")?.style.setProperty("transform", "translateY(60px)");
            }
            prevScrollY.current = currentScrollY.current;
        };
        window.addEventListener("scroll", handleScrollDown);

        return () => {
            window.removeEventListener("scroll", handleScrollDown);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsFilterOpen(true);
            } else {
                setIsFilterOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isFilterOpen]);

    return (
        <main className="min-h-screen w-full py-16 sm:items-start">

            <header id="products-header" className="w-full top-0 sticky bg-light-100 pt-2 pb-4 z-30 transition-all duration-300" >
                <div className="flex flex-col md:flex-row md:justify-between px-16">
                    <h1 className="text-heading-3 text-dark-900">
                        New <span className="hidden md:inline">({totalCount})</span>
                    </h1>
                    <div className="flex justify-between items-center">
                        <p className="mr-2 text-dark-700 md:hidden">{totalCount} Results</p>
                        <Sort isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
                    </div>
                </div>
            </header>

            {/* Body */}
            <section className={`grid grid-cols-1 gap-8 mb-24 transition-all duration-300 md:grid-cols-[240px_1fr] z-50 md:z-20`}>
                <aside style={{ willChange: "transform" }} className={
                    `fixed inset-y-0 bottom-0 z-50 w-full bg-white transform transition-transform duration-300 ease-in-out overflow-auto ` +
                    `${isFilterOpen ? 'translate-y-0' : 'translate-y-full'} ` +
                    `md:static md:left-0 md:transform-none md:shadow-none md:pl-10 ` +
                    `${isFilterOpen ? 'md:translate-x-0' : 'md:-translate-x-full md:translate-y-0'}`
                }
                >
                    {/* Filters */}
                    <div className="md:block overflow-auto z-50">
                        <Filters isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`${isFilterOpen ? 'md:translate-x-0 overflow-hidden' : 'md:p-0 md:-translate-x-65 md:w-[140%]'} transform transition-transform duration-300 `}>
                    {products.length === 0 ? (
                        <p className="text-body-medium text-dark-700 flex justify-center">No products found.</p>
                    ) : (
                        <div className={`grid col-span-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full px-16 py-4 `}>
                            {products.map((product) => {
                                const price = product.minPrice === product.maxPrice ? product.minPrice : `${product.minPrice} - ${product.maxPrice}`;
                                return (
                                    <Card {...product} price={price} key={product.id} />
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main >
    );
}