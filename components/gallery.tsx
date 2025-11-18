'use client'
import { useState } from 'react'
import Image from 'next/image';


const Gallery = ({ product }: { product: { image: string[]; name: string; badge?: { label: string; tone: string; }; } }) => {
    const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);
    return (
            <section className="lg:sticky top-10 flex flex-col-reverse lg:flex-row gap-4 lg:max-h-[600px] z-0">
                <div className="flex flex-row lg:flex-col gap-2 items-start overflow-hidden">
                    {product.image.map((img, index) => (
                        <div key={index} className="bg-black rounded-md" onMouseOver={() => setDisplayedImageIndex(index)}>
                            <Image src={img} alt={`Img${index + 1}`} width={64} height={64} className="object-cover overflow-hidden rounded-md hover:opacity-80 transition-opacity" />
                        </div>
                    ))}
                </div>
                <div className="flex relative aspect-[1/1.25] overflow-hidden h-full rounded-xl">
                    <Image src={product.image[displayedImageIndex]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw" className="object-cover overflow-hidden" />
                    {product.badge && (
                        <span className="absolute top-2 left-2 bg-white text-dark-900 text-body-medium py-2 px-4 rounded-full">
                            {product.badge.label}
                        </span>
                    )}
                    <div className="absolute bottom-0 right-0 p-2">
                        <button className="m-1 p-2 bg-white rounded-full shadow-lg active:bg-light-200" onClick={() => setDisplayedImageIndex(displayedImageIndex === 0 ? product.image.length - 1 : displayedImageIndex - 1)}>
                            <Image src="/chevron-down.svg" alt="Left" width={24} height={24} className="rotate-90" />
                        </button>
                        <button className="m-1 p-2 bg-white rounded-full shadow-lg active:bg-light-200" onClick={() => setDisplayedImageIndex(displayedImageIndex === product.image.length - 1 ? 0 : displayedImageIndex + 1)}>
                            <Image src="/chevron-down.svg" alt="Right" width={24} height={24} className="-rotate-90" />
                        </button>
                    </div>
                </div>
            </section>

    )
}

export default Gallery;