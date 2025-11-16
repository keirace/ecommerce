'use client'
import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Gallery from './gallery'
import SizeSelector from './size-selector'
import ColorSwatches from './color-swatches'
import CollapsibleColumn from './collapsible-column'
import Review, { StarRating } from './review'
import Carousel from './you-might-also-like-carousel'

const detailsColumns = [
    { title: 'Size & Fit', content: 'True to size. We recommend ordering your usual size.', },
    { title: 'Shipping & Returns', content: 'Free shipping on all orders over $50 and free 60-day returns for Nike Members.', },
];

type ProductDetailsClientProps = {
    product: ProductDetail['product'];
    images: ProductDetail['images'];
    variants: ProductDetail['variants'];
    reviews: Review[];
    recommendedProducts: CardProps[];
}

const ProductDetailsClient = ({ product, images, variants, reviews, recommendedProducts }: ProductDetailsClientProps) => {

    const defaultVariant = variants.find(v => v.id == product.defaultVariantId)
    
    const [selectedSize, setSelectedSize] = useState<string | null>(defaultVariant ? defaultVariant.size : null);
    const [selectedColor, setSelectedColor] = useState<string | null>(defaultVariant ? defaultVariant.color : null);
    const selectedVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor);

    const basePrice = selectedVariant ? selectedVariant.price : variants[0].price;
    const salePrice = selectedVariant && selectedVariant.salePrice ? selectedVariant.salePrice : null;
    const displayPrice = salePrice ? salePrice : basePrice;

    const reviewsCount = reviews.length;
    const averageRating = parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1));

    return (
        <main className="min-h-screen w-full mx-auto py-16 md:px-32 px-4">
            <nav className="py-4">
                <Link href="/" className="text-dark-700 hover:text-dark-500">
                    &nbsp;Home&nbsp;
                </Link>
                /
                <Link href='/products' className="text-dark-700 hover:text-dark-500">
                    &nbsp;Products&nbsp;
                </Link>
                /
                <span className="text-body-medium">
                    &nbsp;{product.name}
                </span>
            </nav>

            <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Gallery */}
                <div className="lg:sticky lg:top-10">
                    <Gallery product={{ image: images.map(img => img.url), name: product.name }} />
                </div>
                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <header className="flex flex-col gap-2">
                        <h1 className="text-heading-3">
                            {product.name}
                        </h1>
                        <p className="text-body-small text-dark-700">{product.genderLabel}&apos;s Shoes</p>
                    </header>

                    <div className="flex flex-col">
                        <span className="text-body-medium">${displayPrice}</span>
                    </div>

                    {/* Color Swatches */}
                    <ColorSwatches variants={variants} images={images} selectedColor={selectedColor} setSelectedColor={setSelectedColor} selectedSize={selectedSize} />

                    {/* Size Selector */}
                    <SizeSelector variants={variants} selectedSize={selectedSize} setSelectedSize={setSelectedSize} selectedColor={selectedColor} />

                    <div className="flex flex-col gap-4 mt-6">
                        <button className="text-body-medium w-full flex items-center justify-center gap-2 py-3 rounded-full text-bold bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors disabled:bg-light-400 disabled:text-dark-500" disabled={!selectedVariant || !selectedVariant.inStock}>
                            Add to Cart
                        </button>
                        <button className="text-body-medium w-full flex items-center justify-center gap-2 py-2 rounded-full border-2 border-light-400 hover:border-black">
                            Favorite <Image src="/heart.svg" alt="Favorite" width={24} height={24} />
                        </button>
                    </div>


                    {/* Product details */}
                    <div className="mt-10">
                        <h2 className="text-heading-4 mb-4">Product Details</h2>
                        <p>
                            {product.description}
                        </p>
                        <div className="mt-6 space-y-4">
                            {detailsColumns.map((col) => (
                                <CollapsibleColumn key={col.title} title={col.title}>
                                    <p className="mt-5">{col.content}</p>
                                </CollapsibleColumn>
                            ))}

                            <Suspense fallback={
                                <CollapsibleColumn title={`Reviews (${reviewsCount})`} >
                                    <p className="mt-5">Loading reviews...</p>
                                </CollapsibleColumn>
                            }>
                                <CollapsibleColumn title={`Reviews (${reviewsCount})`} rightMeta={
                                    <StarRating rating={averageRating} />
                                }>
                                    <div className="flex flex-row gap-3 my-6">
                                        <StarRating rating={averageRating} />
                                        {averageRating} Stars
                                    </div>
                                    {reviews.map((review) => (
                                        <Review key={review.id} {...review} />
                                    ))}
                                </CollapsibleColumn>
                            </Suspense>
                        </div>
                    </div>
                </div>

            </section>

            {/* You Might Also Like */}
            <Carousel products={recommendedProducts} />

        </main >
    )
}

export default ProductDetailsClient