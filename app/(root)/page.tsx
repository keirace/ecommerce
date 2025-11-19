import { getAllProductsByFilter } from "@/lib/actions/products.actions";
import { Suspense } from "react";
// import LandingPageClient from '../../components/landing-page-client';
import Card from '@/components/card';
import Image from 'next/image';
import Link from 'next/link';
import { columns } from '@/lib/constants';

export default async function Home() {

    // Fetch products from the API
    const res = await getAllProductsByFilter({});
    const products = await Promise.all(res?.products.map(async (p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image || "/placeholder.png",
        price: p.maxPrice === p.minPrice ? p.minPrice : p.minPrice + " - " + p.maxPrice,
        meta: p.meta,
        badge: p.badge,
    }))) || [];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <main className="min-h-screen w-full pt-32 px-16 sm:items-start">
                <section aria-labelledby="latest" className="pb-12">
                    <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
                        Latest shoes
                    </h2>

                    <div className="grid grid-cols-1 grid-span-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id} {...product} />
                        ))}
                    </div>

                    <div className="mx-auto max-w-7xl pt-32 pb-16">
                        <div className="mb-8 flex justify-center">
                            <Image src="/Logo_NIKE.svg" alt="Nike" width={48} height={48} />
                        </div>

                        {/* footer */}
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
                </section>
            </main>
        </Suspense>
    );
}
