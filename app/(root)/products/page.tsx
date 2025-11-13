import { getAllProductsByFilter } from '@/lib/actions/products.actions';
import ProductsClient from '@/components/products-client';
import { normalizeProductFilters } from '@/lib/query';
// import { MOCK_PRODUCTS } from '@/lib/constants';

type searchParams = {
    [key: string]: string | string[] | undefined;
};

const ProductPage = async ({ searchParams }: { searchParams: Promise<searchParams> }) => {

    const resolvedParams = await searchParams;

    const normalizeArrayParam = normalizeProductFilters(resolvedParams);
    const {products, totalCount} = await getAllProductsByFilter(normalizeArrayParam);

    return (
        <ProductsClient products={products} totalCount={totalCount} />
    )
}

export default ProductPage