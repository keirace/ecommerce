
'use server';
import { products, selectProductSchema } from '@/database/product.model';
import { db } from '@/lib/db';


export const getAllProductsByFilter = async (filter?: any) => {
    const all = await db.select().from(products).where(filter)
    all.forEach((product, index) => {
        const parsed = selectProductSchema.parse(product);
        all[index] = parsed;
    });
    return all;
};

// export const getProductBySlug = async (slug: string) => {
//     const product = await db.select().from(products).where({ slug }).limit(1);
// };