'use client';

import { useState } from "react";
import { footerColumns } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const expand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.currentTarget;
        const index = Array.from(target.parentElement!.children).indexOf(target);
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <footer className="pb-8 mx-10">

            <div className="mx-auto max-w-7xl py-10 border-t border-black/10">
                <div className="lg:grid lg:grid-cols-5">
                    {footerColumns.map((col, index) => {
                        const isExpanded = openIndex === index; // check if the current column is expanded
                        return (
                            <div key={col.title} className="border-b border-light-400 lg:border-none py-5 transition-transform duration-300" >
                                <div className="flex items-center justify-between hover:cursor-pointer" onClick={expand} aria-expanded={isExpanded} >
                                    <h4 className="text-body-medium">{col.title}</h4>
                                    <Image className={`lg:hidden transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} src="/chevron-down.svg" alt="Arrow" width={16} height={16} />
                                </div>
                                <ul className={`space-y-3 transition-all duration-300 lg:max-h-100 lg:mt-5 overflow-hidden ${isExpanded ? "max-h-100 mt-5" : "max-h-0"}`}>
                                    {col.links.map((l) => (
                                        <li key={l}>
                                            <Link
                                                href="#"
                                                className="cursor-pointer text-caption text-dark-700 hover:text-dark-500"
                                            >
                                                {l}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                    <div className="items-start py-5 border-b border-light-400 lg:border-none">
                        <div className="items-center flex gap-1 lg:justify-end">
                            <Image className="text-captiontext-dark-700" src="/globe.svg" alt="Location" width={16} height={16} />
                            <p className="text-caption text-dark-700 text-nowrap">United States</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between py-4 text-dark-700 text-body-medium md:flex-row">
                    <div className="flex items-center pr-3 text-caption">
                        <span>© 2025 Nike, Inc. All Rights Reserved</span>
                    </div>
                    <ul className="flex flex-col md:flex-row items-center gap-6 text-caption">
                        {["Guides", "Terms of Sale", "Terms of Use", "Nike Privacy Policy"].map((t) => (
                            <li key={t}>
                                <Link href="#">{t}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}