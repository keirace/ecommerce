// import { getAllProductsByFilter } from '@/lib/actions/products.actions';
import ProductsClient from '@/components/products-client';
import { MOCK_PRODUCTS } from '@/lib/constants';

type searchParams = {
    [key: string]: string | string[] | undefined;
}

const toArray = <T,>(value: T | T[]): T[] => {
    return Array.isArray(value) ? value : [value];
}

const applyFilters = (resolvedParams: searchParams, products: Product[]): Product[] => {
    const gender = resolvedParams.gender ? toArray<string>(resolvedParams.gender) : undefined;
    const color = resolvedParams.color ? toArray<string>(resolvedParams.color) : undefined;
    const size = resolvedParams.size ? toArray<string>(resolvedParams.size) : undefined;
    const price = resolvedParams['price range'] ? toArray<string>(resolvedParams['price range']) : undefined;

    let filteredProducts = products;

    if (gender) {
        filteredProducts = filteredProducts.filter(product => gender.includes(product.gender.toLowerCase()));
    }

    if (color) {
        filteredProducts = filteredProducts.filter(product => color.some(c => product.colors.includes(c)));
    }

    if (size) {
        filteredProducts = filteredProducts.filter(product => size.some(s => product.sizes.includes(s)));
    }

    if (price) {
        filteredProducts = filteredProducts.filter(product => {
            return price.some(priceRange => {
                if (priceRange === '$0 - $50') {
                    return product.price >= 0 && product.price <= 50;
                } else if (priceRange === '$51 - $100') {
                    return product.price >= 51 && product.price <= 100;
                } else if (priceRange === 'Over $200') {
                    return product.price > 200;
                }
                return false;
            });
        });
    }

    return filteredProducts;
};

const applySort = (sortParam: string | string[] | undefined, products: Product[]): Product[] => {
    const sortedProducts = [...products];

    if (sortParam === 'price-asc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortParam === 'price-desc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortParam === 'newest') {
        sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return sortedProducts;
}

const ProductPage = async ({ searchParams }: { searchParams: Promise<searchParams> }) => {

    const isFilterOpen = false;
    const resolvedParams = await searchParams;
    console.log('Resolved Search Params:', resolvedParams);

    const filteredProducts = applyFilters(resolvedParams, MOCK_PRODUCTS);
    const sortedProducts = applySort(resolvedParams.sort, filteredProducts);

    // const products = await getAllProductsByFilter();

    return (
        <ProductsClient products={sortedProducts} initialIsFilterOpen={isFilterOpen} />
    )
}

export default ProductPage