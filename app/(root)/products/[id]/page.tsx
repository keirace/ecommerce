'use client';
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useRef, useEffect } from 'react'
import Card from "@/components/card";
import Review, { StarRating } from "@/components/review";
// import { getProductBySlug } from '@/lib/actions/products.actions';

const MOCK_DATA = {
    id: "1",
    name: "Nike Air Max Pulse",
    description: "Men's Shoes",
    image: ["/shoes/AIR+JORDAN+1+MID+SE.avif", "/shoes/AIR+JORDAN+1+LOW+SE.avif", "/shoes/AIR+JORDAN+1+MID+SE.avif", "/shoes/AIR+JORDAN+1+LOW+SE.avif", "/shoes/AIR+JORDAN+1+LOW+SE.avif", "/shoes/AIR+JORDAN+1+LOW+SE.avif", "/shoes/AIR+JORDAN+1+LOW+SE.avif"],
    price: 149.99,
    meta: "6 Colour",
    badge: { label: "Best Seller", tone: "orange" },
};

const detailsColumns = [
    { title: 'Size & Fit', content: 'True to size. We recommend ordering your usual size.', },
    { title: 'Shipping & Returns', content: 'Free shipping on all orders over $50 and free 60-day returns for Nike Members.', },
];

const reviews = [
    {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        review: "Great shoes, very comfortable!",
        rating: 5,
        date: "2023-01-01",
    },
    {
        id: 2,
        name: "Jane Smith",
        username: "janesmith",
        review: "Good quality, but a bit pricey.",
        rating: 4,
        date: "2023-01-02",
    },
    {
        id: 3,
        name: "Alice Johnson",
        username: "alicejohnson",
        review: "Not what I expected, the fit is off.",
        rating: 2,
        date: "2023-01-03",
    },
];

function CollapsibleColumn({ title, rightMeta, children }: { title: string; rightMeta?: React.ReactNode; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-b border-light-400 py-3 transition-transform duration-300">
            <div className="flex items-center justify-between w-full hover:cursor-pointer" onClick={toggleOpen} aria-expanded={isOpen}>
                <h4 className="text-heading-3">{title}</h4>
                <span className="flex items-center gap-2">
                    {rightMeta}
                    <Image className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} src="/chevron-down.svg" alt="Arrow" width={16} height={16} />
                </span>
            </div>
            <div className={`flex flex-col justify-start space-y-3 mb-3 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-fit" : "max-h-0"
                }`}>
                {children}
            </div>
        </div>
    );
};

const ProductDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const id = params.then(p => p.id);
    const product = MOCK_DATA; // Replace with actual data fetching logic
    // const data = getProductBySlug(slug);
    const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [scrollable, setScrollable] = useState<{ left: boolean; right: boolean }>({
        left: false,
        right: true,
    });
    const reviewsCount = 124
    const averageRating = 4.5
    
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
                    <section className="flex flex-col-reverse lg:flex-row gap-4 lg:max-h-[600px]">
                        <div className="flex flex-row lg:flex-col gap-2 items-start overflow-hidden">
                            {product.image.map((img, index) => (
                                <div key={index} className="bg-black rounded-md" onMouseOver={() => setDisplayedImageIndex(index)}>
                                    <Image src={img} alt={`Img${index + 1}`} width={64} height={64} className="object-cover overflow-hidden rounded-md hover:opacity-80 transition-opacity" />
                                </div>
                            ))}
                        </div>
                        <div className="flex relative flex-1 aspect-square overflow-hidden rounded-xl">
                            <Image src={product.image[displayedImageIndex]} alt={product.name} layout="fill" objectFit="cover " />
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
                    {/* </div> */}
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <header className="flex flex-col gap-2">
                        <h1 className="text-heading-3">
                            {product.name}
                        </h1>
                        <p className="text-body-small text-dark-700">{product.description}</p>
                    </header>

                    <div className="flex flex-col">
                        <span className="text-body-medium">${product.price}</span>
                    </div>

                    <div className="flex flex-col">
                        <div className="justify-between flex-row flex">

                            <label htmlFor="size" className="mr-4 text-body-medium">Select Size:</label>
                            <button>Size Guide</button>
                        </div>
                        <div className="flex-row gap-2 mt-2 flex">
                            {[6, 7, 8, 9, 10].map(size => (
                                <button key={size} className="mx-1 px-4 py-1 border border-dark-500 rounded hover:border-black hover:cursor-pointer focus:border-black">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <button className="text-body-medium w-full flex items-center justify-center gap-2 py-3 rounded-full text-bold bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors">
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
            <section className="mt-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-heading-3 mb-8">You Might Also Like</h2>
                    <div aria-label="Carousel navigation" className="flex items-center gap-2">
                        <button className="p-4 bg-light-400 rounded-full hover:bg-dark-500 disabled:bg-light-200 disabled:fill-red-500" onClick={() => {carouselRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}} disabled={!scrollable.left}>
                            <Image src="/chevron-down.svg" alt="Left" width={20} height={20} className="rotate-90 fill-red-500 stroke-amber-400" />
                        </button>
                        <button className="p-4 bg-light-400 rounded-full hover:bg-dark-500 disabled:bg-light-200 disabled:text-dark-500" onClick={() => {carouselRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}} disabled={!scrollable.right}>
                            <Image src="/chevron-down.svg" alt="Right" width={20} height={20} className="-rotate-90 fill-red-500 stroke-amber-400" />
                        </button>
                    </div>
                </div>

                <div id="recommended-products" className="flex gap-6 overflow-x-scroll pb-3 snap-x" role="list" aria-label="Recommended products" ref={carouselRef}>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex-none w-64 sm:w-72 md:w-80 snap-start">
                            <Card key={item} {...MOCK_DATA} image={MOCK_DATA.image[0]} />
                        </div>
                    ))}
                </div>
            </section>

        </main >
    )
}

export default ProductDetailsPage