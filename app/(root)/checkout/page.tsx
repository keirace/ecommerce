'use client';
import { CartItem, calculateCartSummary } from '@/components/cart-client';
import { Summary } from '@/components/cart-client';
import CollapsibleColumn from '@/components/collapsible-column';
import Link from 'next/link';
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from '@/components/CheckoutForm';
import { Appearance, loadStripe, StripeCheckoutOptions } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Checkout = () => {

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItemProps[]>([]);

    useEffect(() => {
        const fetchAndCreateSession = async () => {
            try {
                // fetch cart items
                const cartRes = await fetch("/api/cart", { credentials: "include" });
                if (!cartRes.ok) throw new Error("Failed to fetch cart items");
                const cartData = await cartRes.json();
                const items = cartData.items ?? [];
                
                setCartItems(items);

                // build line items to send to checkout route
                const lineItems = items.map((item: CartItemProps) => ({
                    price_data: {
                        currency: "usd",
                        product_data: { name: item.name },
                        unit_amount: Math.round((item.salePrice ?? item.price) * 100),
                    },
                    quantity: item.quantity,
                }));

                // create checkout session using fetched items
                const res = await fetch(`/api/checkout`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lineItems }),
                });

                if (!res.ok) throw new Error("Failed to create checkout session");
                const data = await res.json();
                setClientSecret(data.clientSecret ?? null);
            } catch (err) {
                console.error("Checkout initialization error", err);
                setClientSecret(null);
            }
        };

        fetchAndCreateSession();
    }, []);

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Jost, Sans-serif',
            spacingUnit: '6px',
            fontWeightNormal: '500',
            fontWeightMedium: '600',
            fontWeightBold: '700',
            fontSizeBase: '14px',
        },
        rules: {
            '.Input': {
                border: '1px solid #d1d5dc',
                boxShadow: 'none',
                fontSize: '15px',
            },
            '.Input:selected': {
                boxShadow: 'none',
                borderLeftWidth: '6px',
                outlineOffset: '2px',
                outline: '1px solid #000000'
            },
            '.Label': {
                fontWeight: '500',
                fontSize: '15px'
            }
        }
    };

    const options: StripeCheckoutOptions = {
        clientSecret: clientSecret!,
        elementsOptions: { appearance, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Jost&display=swap" }] },
    }

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const freeShippingThreshold = 50;
    const { shipping, totalPrice, taxes } = calculateCartSummary(totalItems, cartItems, freeShippingThreshold); // Assuming 10% tax

    return (
        <main className="mx-auto min-h-screen py-16 w-full items-center">
            <div className='flex justify-center items-center my-16'>
                <h1 className="text-heading-3">Checkout</h1>
            </div>

            <div className="px-16 max-w-6xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
                {/* Stripe Checkout */}

                {clientSecret ? (<CheckoutProvider stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </CheckoutProvider>) : <div>Preparing payment...</div>}

                {/* Bag */}
                <div className="w-full lg:hidden">
                    <CollapsibleColumn title="In Your Bag">
                        <Summary totalPrice={totalPrice} shipping={shipping} taxes={taxes} />
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item, index) => (
                                <CartItem key={index} item={item} setCartItems={() => { }} />
                            ))}
                        </div>
                    </CollapsibleColumn>
                </div>
                <div className="w-full hidden lg:block">
                    <div className="justify-between lg:flex">
                        <h2 className="text-heading-3 mb-4">In Your Bag</h2>
                        <button className="underline-offset-4 underline">
                            <Link href="/cart">Edit</Link>
                        </button>
                    </div>
                    <Summary totalPrice={totalPrice} shipping={shipping} taxes={taxes} />
                    <div className="flex flex-col gap-4 w-full">
                        {cartItems.map((item, index) => (
                            <CartItem key={index} item={item} setCartItems={() => { }} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Checkout