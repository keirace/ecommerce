"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const NAV_LINKS = [
    { label: "Men", href: "/products?gender=men" },
    { label: "Women", href: "/products?gender=women" },
    { label: "Kids", href: "/products?gender=unisex" },
    { label: "Collections", href: "/collections" },
    { label: "Contact", href: "/contact" },
];

const handleScrollDown = (currentScrollY: React.RefObject<number>, prevScrollY: React.RefObject<number>, elementId: string) => {
    currentScrollY.current = window.pageYOffset;
    // Scroll down - hide navbar
    if (currentScrollY.current > prevScrollY.current) {
        document.getElementById(elementId)?.style.setProperty("transform", "translateY(-100%)");
    } else {
        document.getElementById(elementId)?.style.setProperty("transform", "translateY(0)");
    }
    prevScrollY.current = currentScrollY.current;
};

const Navbar = () => {

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    // Removed window access on initial render for SSR compatibility
    const prevScrollY = useRef<number>(0);
    const currentScrollY = useRef<number>(0);

    // handle scroll to hide/show navbar
    useEffect(() => {
        if (!isOpen) {
            window.addEventListener("scroll", () => handleScrollDown(currentScrollY, prevScrollY, "desktop-menu"));
        }

        return () => {
            window.removeEventListener("scroll", () => handleScrollDown(currentScrollY, prevScrollY, "desktop-menu"));
        };
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("search") as string;
        // Redirect to search page with query
        router.push(`/products?search=${encodeURIComponent(query)}`);
    };

    const handleSignIn = async () => {
        if ((await getCurrentUser()).ok) {
            router.push('/profile');
        } else {
            router.push('/lookup');
        }
    };

    return (
        <header id="desktop-menu" className="fixed top-0 left-0 right-0 z-999 bg-white transition-transform duration-300">
            <nav className="flex justify-between items-center h-16  px-10">
                <Link href="/" aria-label="Home" className="logo"><Image src="/Logo_NIKE.svg" alt="Logo" width={55} height={55} preload={true} /></Link>

                <ul className="gap-8 hidden md:flex font-semibold">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="hover:underline underline-offset-7 decoration-2" scroll={true}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                <div className="flex gap-2 justify-end">
                <div className="gap-2 flex items-center">
                    <form className="flex items-center lg:bg-black/5 rounded-4xl hover:bg-black/10 focus:bg-black/10" onSubmit={handleSearch}>
                        <label htmlFor="search" className="sr-only">Search</label>
                        <label htmlFor="search" className="cursor-pointer m-2"><Image src="/search.svg" alt="Search" width={20} height={20} /></label>
                        <input type="text" id="search" name="search" placeholder="Search" className="outline-none ml-2 hidden lg:inline " />
                    </form>
                    <button onClick={() => handleSignIn()} className="p-2 rounded-4xl hover:bg-black/10"><Image src="/person.svg" alt="Sign In" width={22} height={22} /></button>
                    <Link href="/favorites" className="p-2 rounded-4xl hover:bg-black/10"><Image src="/heart.svg" alt="Favorites" width={20} height={20} /></Link>
                    <Link href="/cart" className="p-2 rounded-4xl hover:bg-black/10"><Image src="/bag.svg" alt="Cart" width={20} height={20} /></Link>
                </div>

                {/* mobile menu + backdrop */}
                <div className="md:hidden flex items-center">
                    {/* backdrop */}
                    <div className={`fixed inset-0 top-15 h-lvh bg-black/30 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} aria-hidden={!isOpen} />

                    {/* hamburger button */}
                    <button className="cursor-pointer px-2 py-3 rounded-4xl hover:bg-black/10" aria-label="Menu" aria-controls="mobile-menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                        <span className="sr-only">Toggle navigation</span> {/** screen reader only */}
                        <span className={`block h-0.5 w-6 bg-dark-900 duration-300  origin-center ${isOpen ? "translate-y-0.5 rotate-45" : "mb-1"}`}></span>
                        <span className={`block h-0.5 w-6 bg-dark-900 ${isOpen ? "opacity-0" : "mb-1"}`}></span>
                        <span className={`block h-0.5 w-6 bg-dark-900 duration-300 origin-center ${isOpen ? "-translate-y-0.5 -rotate-45" : ""}`}></span>
                    </button>

                    {/* menu */}
                    <div className={`fixed left-0 right-0 duration-200 transition-all ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-9 pointer-events-none'}`} onClick={() => setIsOpen(false)}>
                        <ul id="mobile-menu" className="absolute top-full mt-6 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 gap-4" onClick={(e) => e.stopPropagation()} aria-hidden={!isOpen}>
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-4 flex gap-6">
                                <Link href="/search" className="hover:underline">Search</Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:underline">Cart</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar