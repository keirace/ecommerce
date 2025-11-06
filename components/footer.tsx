'use client';

import { useState } from "react";
import { columns, footerColumns } from "@/lib/constants";
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
            <div className="mx-auto max-w-7xl py-12">
                <div className="mb-8 flex justify-center">
                    <Image src="/Logo_NIKE.svg" alt="Nike" width={48} height={48} />
                </div>
                <div className="items-start max-w-4xl mx-auto">
                    <div className="grid gap-8 grid-cols-4 md:col-span-7">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="mb-4 text-heading-4 py-5">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.links.map((l) => (
                                        <li key={l}>
                                            <Link
                                                href="#"
                                                className="text-body-medium text-dark-700 hover:text-dark-500 block truncate"
                                            >
                                                {l}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl py-10 border-t border-black/10">
                <div className="lg:grid lg:grid-cols-5">
                    {footerColumns.map((col, index) => {
                        const isExpanded = openIndex === index; // check if the current column is expanded
                        return (
                            <div key={col.title} className="border-b border-light-400 lg:border-none py-5 cursor-pointer transition-transform duration-300 group" onClick={expand} aria-expanded={isExpanded}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-body-medium">{col.title}</h4>
                                    <Image className={`lg:hidden transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} src="/chevron-down.svg" alt="Arrow" width={16} height={16} />
                                </div>
                                <ul className={`mt-5 space-y-3 transition-all duration-300 ${isExpanded ? "block" : "hidden"
                                    } lg:block`}>
                                    {col.links.map((l) => (
                                        <li key={l}>
                                            <Link
                                                href="#"
                                                className="text-caption text-dark-700 hover:text-dark-500"
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
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 p-4 text-dark-700 text-body-medium md:flex-row sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 text-caption">
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