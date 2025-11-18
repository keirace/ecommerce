import { useEffect } from 'react'
import { createPortal } from 'react-dom';
import Image from 'next/image'
import Link from 'next/link'

type variant = {
    id: string;
    size: string;
    color: string;
    price: string | null;
    salePrice?: string | null;
}

const CartModal = ({ open, setOpen, product, selectedVariant }: { open: boolean, setOpen: (open: boolean) => void, product: ProductDetail['product'], selectedVariant: variant | null }) => {

    useEffect(() => {
        if (open) {
            // Prevent background scrolling when modal is open
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                setOpen(false);
            }, 5000); // Auto close after 5 seconds
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open, setOpen]);

    return (
        // createPortal(
        <>
            <div className={`fixed z-40 inset-0 transition-opacity ${open ? 'opacity-100 ' : 'opacity-0 pointer-events-none'}`}>

                {/* backdrop */}
                <div className="fixed inset-0 bg-black opacity-50 z-20" onClick={() => setOpen(false)} />

                {/* cart modal */}
                <div className="fixed top-14 right-5 w-100 bg-white p-8 rounded-4xl shadow-md z-9999 max-w-sm" role="dialog" aria-modal="true" aria-labelledby="cart-popup-title">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex align-baseline gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill fill-green-600" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            <h2 className="text-lg font-bold mb-2"> Added to Bag</h2>
                        </div>
                        <button className="bg-light-300 rounded-full p-3 hover:bg-light-400" onClick={() => setOpen(false)} aria-label="Close cart popup"><Image src="/x-lg.svg" alt="Close" width={16} height={16} /></button>
                    </div>

                    {/* Product details */}
                    <div className="flex items-center gap-4">
                        <Image src="/product-sample.jpg" alt="Product" width={80} height={80} className="rounded-md" />
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">Size: {selectedVariant?.size}</p>
                            <p className="text-sm text-gray-600">Color: {selectedVariant?.color}</p>
                            <p className="font-bold mt-2">${selectedVariant?.salePrice ? selectedVariant?.salePrice : selectedVariant?.price}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 py-3 flex flex-col gap-3">
                        <Link href="/cart" className="block">
                            <button className="w-full border-2 border-light-300 px-4 py-3 rounded-full hover:border-black">View Bag</button>
                        </Link>
                        <Link href="/checkout" className="block">
                            <button className="w-full bg-dark-900 text-light-100 px-4 py-4 rounded-full hover:bg-dark-700">Checkout</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
        // , document.body)
    )
}

export default CartModal