'use client'

type SizeProps = {
    variants: ProductDetail['variants'];
    selectedSize: string | null;
    setSelectedSize: (size: string | null) => void;
    selectedColor: string | null;
}

const SizeSelector = ({ variants, selectedSize, setSelectedSize, selectedColor }: SizeProps) => {

    const sizes = Array.from(new Set(variants.map(v => v.size)));
    
    return (
        <div className="flex flex-col">
            <div className="justify-between flex-row flex">
                <label htmlFor="size" className="mr-4 text-body-medium">Select Size:</label>
                <button>Size Guide</button>
            </div>
            <div className="flex-row gap-2 mt-2 flex flex-wrap" role="list" aria-label="Available sizes">
                {sizes.map(size => (
                    <button key={size} role="listitem" className={`mx-1 px-5 py-2 border rounded hover:border-black hover:cursor-pointer ${!variants.find(v => v.color === selectedColor && v.size === size)?.inStock ? 'line-through bg-light-300 text-dark-500' : ''} ${selectedSize === size ? 'border-black' : 'border-dark-500'}`} onClick={() => setSelectedSize(size)}>
                        {size}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SizeSelector