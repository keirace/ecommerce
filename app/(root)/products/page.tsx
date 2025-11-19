import { getAllProductsByFilter } from '@/lib/actions/products.actions';
import ProductsClient from '@/components/products-client';
import { normalizeProductFilters } from '@/lib/query';
import { Suspense } from 'react';

type searchParams = {
    [key: string]: string | string[] | undefined;
};


const ProductPage = async ({ searchParams }: { searchParams: Promise<searchParams> }) => {
    const resolvedParams = await searchParams;
    const normalizeArrayParam = normalizeProductFilters(resolvedParams);

    const { products, totalCount } = await getAllProductsByFilter(normalizeArrayParam);

    return (
        <Suspense>
            <ProductsClient products={products} totalCount={totalCount} />
        </Suspense>
    );
};

export default ProductPage