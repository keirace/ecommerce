'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Card from './card';

const Carousel = ({ products, className }: { products: CardProps[]; className?: string }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [scrollable, setScrollable] = useState<{ left: boolean; right: boolean }>({
        left: false,
        right: true,
    });

    useEffect(() => {
        const ref = carouselRef.current;
        const handleScroll = () => {
            if (ref) {
                const { scrollLeft, scrollWidth, clientWidth } = ref;
                setScrollable({
                    left: scrollLeft > 0,
                    right: scrollLeft + clientWidth < scrollWidth,
                });
            }
        };

        ref?.addEventListener('scroll', handleScroll);
        return () => {
            ref?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className={`mt-16 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-heading-3 flex">You Might Also Like</h2>
                <div aria-label="Carousel navigation" className="flex gap-2">
                    <button className="p-3 bg-light-300 rounded-full hover:bg-light-400 disabled:bg-light-200 disabled:fill-red-500" onClick={() => { carouselRef.current?.scrollBy({ left: -200, behavior: 'smooth' }) }} disabled={!scrollable.left}>
                        <Image src="/chevron-down.svg" alt="Left" width={20} height={20} className="rotate-90 fill-red-500 stroke-amber-400" />
                    </button>
                    <button className="p-3 bg-light-300 rounded-full hover:bg-light-400 disabled:bg-light-200 disabled:text-dark-500" onClick={() => { carouselRef.current?.scrollBy({ left: 200, behavior: 'smooth' }) }} disabled={!scrollable.right}>
                        <Image src="/chevron-down.svg" alt="Right" width={20} height={20} className="-rotate-90 fill-red-500 stroke-amber-400" />
                    </button>
                </div>
            </div>

            <div id="recommended-products" className="flex gap-6 overflow-x-scroll pb-3 snap-x" role="list" aria-label="Recommended products" ref={carouselRef}>
                {products.map((item) => (
                    <div key={item.variantId} className="flex-none w-64 sm:w-72 md:w-80 snap-start">
                        <Card key={item.id} {...item} price={item.price} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Carousel