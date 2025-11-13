"use server";
import { db } from "@/lib/db";
import * as schema from "@/database/index";
import { eq, gte, lte, SQL, ilike, inArray, and, sql, asc, desc, count } from "drizzle-orm";

export const getAllProductsByFilter = async (filter?: NormalizedProductFilters): Promise<{ products: Product[]; totalCount: number }> => {
	const conditions: SQL[] = [eq(schema.products.isPublished, true)];
	const variantConditions: SQL[] = [];

	if (filter?.search) {
		conditions.push(ilike(schema.products.name, `%${filter.search}%`));
	}

	if (filter?.genders?.length) {
		conditions.push(inArray(schema.genders.slug, filter.genders));
	}

	if (filter?.brands?.length) {
		conditions.push(inArray(schema.brands.slug, filter.brands));
	}

	if (filter?.categories?.length) {
		conditions.push(inArray(schema.categories.slug, filter.categories));
	}

	if (filter?.minPrice) {
        console.log('min ----')
		variantConditions.push(gte(schema.productVariants.price, filter.minPrice));
	}

	if (filter?.maxPrice) {
		variantConditions.push(lte(schema.productVariants.price, filter.maxPrice));
	}

	if (filter?.colors?.length) {
		variantConditions.push(inArray(schema.productVariants.color, db.select({ id: schema.colors.id }).from(schema.colors).where(inArray(schema.colors.slug, filter.colors))));
	}

	if (filter?.sizes?.length) {
		variantConditions.push(inArray(schema.productVariants.size, db.select({ id: schema.sizes.id }).from(schema.sizes).where(inArray(schema.sizes.slug, filter.sizes))));
	}

	const variantJoin = db
		.select({ productId: schema.productVariants.productId, price: schema.productVariants.price })
		.from(schema.productVariants)
		.where(variantConditions.length ? and(...variantConditions) : undefined)
        .groupBy(schema.productVariants.productId, schema.productVariants.price)
		.as("variant_filter");

	const rows = await db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			description: schema.genders.label,
			image: sql<string>`(SELECT url FROM images WHERE product_id = ${schema.products.id} LIMIT 1)`,
			minPrice: sql<number> `min(${variantJoin.price})`,
			maxPrice: sql<number> `max(${variantJoin.price})`
		})
		.from(schema.products)
		.innerJoin(schema.genders, eq(schema.products.genderId, schema.genders.id))
		.innerJoin(schema.brands, eq(schema.products.brandId, schema.brands.id))
		.innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
		.innerJoin(variantJoin, eq(variantJoin.productId, schema.products.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.groupBy(schema.products.id, schema.products.name, schema.products.createdAt, schema.genders.label)
		.orderBy(
			filter?.sort === "price-asc"
				? asc(sql`MIN(${schema.productVariants.price})`)
				: filter?.sort === "price-desc"
				? desc(sql`MAX(${schema.productVariants.price})`)
				: filter?.sort === "newest"
				? desc(schema.products.createdAt)
				: asc(schema.products.name)
		)
		.limit(filter?.limit || 10)
		.offset(((filter?.pages || 1) - 1) * (filter?.limit || 10));

	const totalCountRows = await db
		.select({ cnt: count(sql<number>`DISTINCT ${schema.products.id}`) })
		.from(schema.products)
		.innerJoin(schema.genders, eq(schema.products.genderId, schema.genders.id))
		.innerJoin(schema.brands, eq(schema.products.brandId, schema.brands.id))
		.innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
		.innerJoin(variantJoin, eq(variantJoin.productId, schema.products.id))
		.where(conditions.length ? and(...conditions) : undefined);

	return { products: rows, totalCount: Number(totalCountRows[0]?.cnt || 0) };
};

// export const getProductBySlug = async (slug: string) => {
//     const product = await db.select().from(products).where({ slug }).limit(1);
// };
