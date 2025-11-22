'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Carousel from './you-might-also-like-carousel';
import Image from 'next/image';
import { incrementCartItemQuantity, removeCartItem } from '@/lib/actions/cart.actions';
import { addProductToFavorites } from '@/lib/actions/wishlist.actions';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';

export function calculateCartSummary(totalItems: number, cartItems: CartItemProps[], freeShippingThreshold: number) {
    const totalPrice = totalItems > 0 ? cartItems.reduce((acc, item) => acc + (item.salePrice ?? item.price) * item.quantity, 0) : 0;

    const shipping = totalPrice > freeShippingThreshold ? 0 : 5; // Free shipping for orders over $50
    const taxes = totalPrice * 0.1; // Assuming 10% tax
    return { shipping, totalPrice, taxes };
}

export const Summary = ({ totalPrice, shipping, taxes }: { totalPrice: number, shipping: number, taxes: number }) => {
    return <div className='flex flex-col gap-4 py-6'>
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
    </div>;
}

export const CartItem = ({ item, setCartItems, className, children }: { item: CartItemProps, setCartItems: React.Dispatch<React.SetStateAction<CartItemProps[]>>, className?: string, children?: React.ReactNode }) => {

    return (
        <div className={`flex flex-col items-start py-6 ${className}`}>
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
                {children}
        </div>
    )
}


const CartClient = () => {
    const [cartItems, setCartItems] = useState<CartItemProps[]>([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch("/api/cart", { credentials: 'include' });
                const data = await response.json();
                setCartItems(data.items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };
        fetchCartItems();
    }, []);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const freeShippingThreshold = 50;
    const { shipping, totalPrice, taxes } = calculateCartSummary(totalItems, cartItems, freeShippingThreshold); // Assuming 10% tax

    const freeShippingMessage = shipping === 0 ? <>You qualify for <span className='font-bold'>Free Shipping</span></> : <>Add <span className='font-bold'>${(freeShippingThreshold - totalPrice).toFixed(2)}</span> more to qualify for free shipping.</>;
    const freeShippingBarWidth = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        weekday: 'long',
    });

        const handleRemoveItem = (itemId: string | number, quantity: number) => {
        if (!itemId) return;
        // if quantity > 1, decrease quantity instead of removing
        if (quantity > 1) {
            setCartItems(prevItems => prevItems.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
        }
        removeCartItem(itemId, quantity);
    };

    const handleAddItem = (itemId: string | number) => {
        if (!itemId) return;
        // Increase quantity by 1
        setCartItems(prevItems => prevItems.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
        incrementCartItemQuantity(itemId, 1);
    };

    const router = useRouter();
    const handleAddToFavorites = async (itemId: string | number) => {
        if (!itemId) return;
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/lookup');
        }
        addProductToFavorites((itemId), user!.id);
    };

    return (
        <div className="px-16">
            <div className='max-w-6xl mx-auto py-32 grid lg:grid-cols-[2fr_1fr] gap-8 items-start'>
                {/* Cart Items */}
                <div className='flex flex-col w-full justify-center'>
                    <h2 className='text-heading-3 mb-4'>Bag</h2>
                    <h3 className='lg:hidden border-b border-light-300 pb-8'><span className='text-dark-700'>{totalItems} Item{totalItems === 1 ? "" : "s"} | </span> ${totalPrice.toFixed(2)}</h3>
                    {totalItems > 0 ? (
                        <>
                            {
                                cartItems.map((item, index) => <CartItem key={index} item={item} setCartItems={setCartItems} className="mr-4" >
                                    <div className='flex gap-3 items-center w-full mt-4'>
                                        <div className="flex items-center justify-between border-light-300 border rounded-full gap-2">
                                            <button className='p-3 hover:text-dark-700 hover:bg-light-300 rounded-full' onClick={() => handleRemoveItem(item.id, item.quantity)}><Image src="/trash3.svg" alt="Remove item" width={16} height={16} /></button>
                                            <span className=''>{item.quantity}</span>
                                            <button className='p-3 hover:text-dark-700 hover:bg-light-300 rounded-full' onClick={() => handleAddItem(item.id)}><Image src="/plus-lg.svg" alt="Add item" width={16} height={16} /></button>
                                        </div>
                                        <button className='p-3 border border-light-300 hover:text-dark-700 hover:bg-light-300 rounded-full' onClick={() => handleAddToFavorites(item.id)} ><Image src="/heart.svg" alt="Add to favorites" width={16} height={16} /></button>
                                    </div>
                                </CartItem>)
                            }
                            <div>
                                <p className="text-heading-4">Shipping</p>
                                <p className="">Arrives by {formatter.format(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000))}</p>
                            </div>
                        </>
                    ) : (
                        <p>Your bag is currently empty.</p>
                    )}
                </div>

                {/* Summary */}
                <div className='flex flex-col'>
                    <h2 className='text-heading-3 mb-4'>Summary</h2>
                    <Summary totalPrice={totalPrice} shipping={shipping} taxes={taxes} />
                    <p className="text-caption">{freeShippingMessage} as a Member! <Link href="/signup" className='font-bold underline underline-offset-3'>Join us</Link> or <Link href="/signin" className='font-bold underline underline-offset-3'>Sign-in</Link></p>
                    <div className="flex items-center gap-2">
                        <div className="w-full mt-4 mb-4 relative">
                            <div className="absolute inset-0 h-2 bg-light-300 rounded-full"></div>
                            <div className="absolute inset-0 h-2 bg-green-700 rounded-full" style={{ width: `${freeShippingBarWidth}%` }}></div>
                        </div>
                        ${freeShippingThreshold}
                    </div>
                    <Link href="/checkout">
                        <button className='mt-8 text-body-medium w-full flex items-center justify-center gap-2 py-3 rounded-full text-bold bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors disabled:bg-light-400 disabled:text-dark-500' disabled={cartItems.length === 0}>
                            Checkout
                        </button>
                    </Link>
                </div>
            </div>

            {/* You might also like */}
            {/* <Carousel products={recommendedProducts} /> */}
        </div>
    )
}

export default CartClient
