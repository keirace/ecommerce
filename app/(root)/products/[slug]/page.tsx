
const ProductDetailsPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = params.then(p => p.slug);

    return (
        <main className="min-h-screen w-full py-32 px-16 sm:items-start">
            <h1>Product Page: {slug}</h1>

        </main>
    )
}

export default ProductDetailsPage