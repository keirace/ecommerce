import { getProductById, getRecommendedProducts, getReviewsByProductId } from '@/lib/actions/products.actions';
import Carousel from "@/components/you-might-also-like-carousel";
import ProductDetailsClient from "@/components/product-details-client";
import { getCurrentUser, getGuestSession } from '@/lib/actions/auth.actions';

export async function ensureGuestSession(): Promise<{ ok: boolean; sessionToken: string | null }> {
    const response = await getGuestSession();
    const token = response.token;
    console.log("Current session in ensureGuestSession:", token);

    if (!token) {
        const response = await fetch("/api/auth/guest", { method: "POST", credentials: "include" });
        const data = await response.json();
        console.log("Created guest session:", data);
        return data;
    }
    return { ok: true, sessionToken: token };
}

const ProductDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Fetch product data
    const result: ProductDetail | null = await getProductById(id);

    // You might also like - fetch recommended products
    const recommendedProducts = await getRecommendedProducts(id, 8);

    if (!result) {
        return <div className="min-h-screen w-full mx-auto py-16 md:px-32 px-8 flex flex-col justify-center text-heading-4">
            THE PRODUCT YOU ARE LOOKING FOR IS NO LONGER AVAILABLE

            <Carousel products={recommendedProducts} />
        </div>;
    }

    const { product, variants, images } = result;

    // Fetch reviews
    const reviews = await getReviewsByProductId(id);

    return (
        <ProductDetailsClient product={product} images={images} variants={variants} reviews={reviews} recommendedProducts={recommendedProducts} />
    )
}

export default ProductDetailsPage