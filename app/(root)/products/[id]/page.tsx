import { getProductById, getRecommendedProducts, getReviewsByProductId } from '@/lib/actions/products.actions';
// import Carousel from "@/components/you-might-also-like-carousel";
import ProductDetailsClient from "@/components/product-details-client";
import { Suspense } from 'react';

const ProductDetailsContent = async ({ params }: { params: Promise<string> }) => {

    const id = await params;

    const [product, recommendedProducts, reviews] = await Promise.all([
        getProductById(id),
        getRecommendedProducts(id, 8),
        getReviewsByProductId(id)
    ]);
    

    if (!product) {
        return (
            <div className="min-h-screen w-full mx-auto py-16 md:px-32 px-8 flex flex-col justify-center text-heading-4">
                THE PRODUCT YOU ARE LOOKING FOR IS NO LONGER AVAILABLE
            </div>
        );
    }

    return (<ProductDetailsClient
        product={product.product}
        images={product.images}
        variants={product.variants}
        reviews={reviews}
        recommendedProducts={recommendedProducts}
    />)
}
const ProductDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const id = params.then(p => p.id);

    return (
        <Suspense fallback={<div>Loading product details...</div>}>
            <ProductDetailsContent params={id} />
        </Suspense>
    );
}

export default ProductDetailsPage;