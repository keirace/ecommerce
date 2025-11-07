
import { MOCK_PRODUCTS as products } from "../../lib/constants";
import Card from "@/components/card";
import { getCurrentUser } from "@/lib/auth.actions";

export default async function Home() {
  const currentUser = await getCurrentUser();
  console.log("Current User:", currentUser);

  return (
    <main className="min-h-screen w-full py-32 px-16 sm:items-start">
      <section aria-labelledby="latest" className="pb-12">
        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Latest shoes
        </h2>

        <div className="grid grid-cols-1 grid-span-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} {...product} slug={product.id.toString()} />
          ))}
        </div>
      </section>
    </main>
  );
}
