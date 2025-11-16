'use client'

import Image from 'next/image'

type ColorSwatchesProps = {
    variants: ProductDetail['variants'];
    images: { variantId?: string; url: string; }[];
    selectedColor: string | null;
    setSelectedColor: (color: string | null) => void;
    selectedSize: string | null;
}

const ColorSwatches = ({ variants, images, selectedColor, setSelectedColor, selectedSize }: ColorSwatchesProps) => {
    const outOfStockColors = variants.filter(v => v.size === selectedSize && !v.inStock).map(v => v.color);

    return (
        <div className="flex flex-wrap gap-4" role="list" aria-label="Available colors">
            {variants.map((variant, i) => {
                const img = images.find(img => img.variantId === variant.id);
                if (!img) return null;
                return (
                    <button key={i} role="listitem" aria-label={variant.color} className={`rounded-sm overflow-hidden hover:cursor-pointer relative w-32 h-32 lg:w-24 lg:h-24 ${selectedColor === variant.color ? 'ring-2 ring-black' : ''}`} onClick={() => setSelectedColor(variant.color)} >
                        <label className="sr-only">{variant.color}</label>
                        <Image key={variant.id} src={img.url} alt={variant.color} fill className="object-cover rounded-sm" sizes="(max-width: 640px) 64px, (min-width: 641px) 100px" />
                        {outOfStockColors.includes(variant.color) && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                {/* diagonal line */}
                                <svg className="stroke-white/80 fill-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" strokeWidth={1} stroke="currentColor">
                                    <line x1="4" y1="28" x2="28" y2="4"  />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    )
}

export default ColorSwatches