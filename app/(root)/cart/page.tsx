'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Carousel from '@/components/you-might-also-like-carousel'

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Nike Air Max 270',
        description: 'Men\'s Shoe',
        image: '/shoes/AIR+JORDAN+1+LOW+SE.avif',
        price: 150,
        salePrice: 120,
        color: 'blue',
        size: '10',
    },
    {
        id: 2,
        name: 'Nike Air Force 1',
        description: 'Women\'s Shoe',
        image: '/shoes/AIR+FORCE+1+MID+SE.avif',
        price: 120,
        salePrice: null,
        color: 'red',
        size: '8',
    },
];

type CartItemProps = {
    id: string | number;
    name: string;
    description: string | null;
    image: string;
    price: number;
    salePrice: number | null;
    color: string;
    size: string;
}

const CartItem = ({ item }: { item: CartItemProps }) => {

    return (
        <div className='flex flex-col items-start py-6 mr-8'>
            <div className='flex items-start justify-between w-full'>
                <div className='flex items-start gap-4'>
                    <div className='w-32 h-32 bg-gray-200 rounded-md relative overflow-hidden'>
                        <Image src={item.image} alt={item.name} fill className='object-cover rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-body-medium'>{item.description}</span>
                        <span className='text-body text-dark-700'>Color: {item.color}</span>
                        <span className='text-body text-dark-700'>Size: {item.size}</span>
                    </div>
                </div>
                <div className='flex flex-col items-end'>
                    {item.salePrice === null ? (
                        <span className='text-body-medium text-green-700'>${item.price}</span>
                    ) : (
                        <span className='text-body-medium text-green-700'><span className='line-through text-dark-500 mr-1'>${item.price}</span> ${item.salePrice}</span>
                    )}
                </div>
            </div>
            <div className='flex gap-3 items-center w-full mt-4'>
                <div className="flex items-center justify-between border-light-300 border rounded-full gap-2">
                    <button className='p-3 hover:text-dark-700 hover:bg-light-300 rounded-full'><Image src="/trash3.svg" alt="Remove item" width={16} height={16} /></button>
                    <span className=''>1</span>
                    <button className='p-3 hover:text-dark-700 hover:bg-light-300 rounded-full'><Image src="/plus-lg.svg" alt="Add item" width={16} height={16} /></button>
                </div>
                <button className='p-3 border border-light-300 hover:text-dark-700 hover:bg-light-300 rounded-full'><Image src="/heart.svg" alt="Add to favorites" width={16} height={16} /></button>
            </div>
        </div>
    )
}

const Cart = () => {
    // const [cartItems, setCartItems] = React.useState([]);
    const cartItems = MOCK_PRODUCTS;
    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    const freeShippingThreshold = 50;

    const shipping = totalPrice > freeShippingThreshold ? 0 : 5; // Free shipping for orders over $50
    const taxes = totalPrice * 0.1; // Assuming 10% tax

    const freeShippingMessage = shipping === 0 ? <>You qualify for <span className='font-bold'>Free Shipping</span></> : <>Add <span className='font-bold'>${(freeShippingThreshold - totalPrice).toFixed(2)}</span> more to qualify for free shipping.</>;
    const freeShippingBarWidth = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        weekday: 'long',
    });

    return (
        <div className="px-16">
            <div className='max-w-6xl mx-auto py-32 grid lg:grid-cols-[2fr_1fr] gap-8 '>
                {/* Cart Items */}
                <div className='flex flex-col w-full justify-center'>
                    <div><h2 className='text-heading-3 mb-4'>Bag</h2></div>
                    <h3 className='lg:hidden border-b border-light-300 pb-8'><span className='text-dark-700'>{totalItems} Item{totalItems === 1 ? "" : "s"} | </span> ${totalPrice.toFixed(2)}</h3>
                    <Suspense fallback={<div>Loading...</div>}>
                        {totalItems > 0 ? (
                            <>
                                {cartItems.map((item, index) => <CartItem key={index} item={item} />)}
                                <div>
                                    <p className="text-heading-4">Shipping</p>
                                    <p className="">Arrives by {formatter.format(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000))}</p>
                                </div>
                            </>
                        ) : (
                            <p>Your bag is currently empty.</p>
                        )}
                    </Suspense>
                </div>

                {/* Summary */}
                <div className='flex flex-col'>
                    <h2 className='text-heading-3 mb-4'>Summary</h2>
                    <div className='flex flex-col gap-4 py-6'>
                        <div className='flex justify-between'>
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Estimated Shipping & Handling</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Tax</span>
                            <span>${taxes.toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between border-y py-4 border-light-400'>
                            <span className='text-heading-5 font-bold'>Total</span>
                            <span className='text-heading-5 font-bold'>${(totalPrice + taxes).toFixed(2)}</span>
                        </div>
                    </div>
                    <p className="text-caption">{freeShippingMessage} as a Member! <Link href="/signup" className='font-bold underline underline-offset-3'>Join us</Link> or <Link href="/signin" className='font-bold underline underline-offset-3'>Sign-in</Link></p>
                    <div className="flex items-center gap-2">
                        <div className="w-full mt-4 mb-4 relative">
                            <div className="absolute inset-0 h-2 bg-light-300 rounded-full"></div>
                            <div className="absolute inset-0 h-2 bg-green-700 rounded-full" style={{ width: `${freeShippingBarWidth}%` }}></div>
                        </div>
                        ${freeShippingThreshold}
                    </div>
                    <button className='mt-8 text-body-medium w-full flex items-center justify-center gap-2 py-3 rounded-full text-bold bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors disabled:bg-light-400 disabled:text-dark-500' disabled={cartItems.length === 0}>
                        <Link href="/checkout">Checkout</Link>
                    </button>
                </div>
            </div>

            {/* You might also like */}
            <Carousel products={[{ id: 1, name: 'Product 1', price: 100 }, { id: 2, name: 'Product 2', price: 150 }]} />
        </div>
    )
}

export default Cart