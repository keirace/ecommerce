"use server";
import { db } from "@/lib/db";
import * as schema from "@/database/index";
import { eq, gte, lte, SQL, ilike, inArray, and, sql, asc, desc, count, not, min, max } from "drizzle-orm";
import { validate as isUuid } from "uuid";

/**
 * Get all products by filter
 * @param filter
 * @returns { products: Product[]; totalCount: number }
 */
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

	// Subquery: one row per product with aggregated price range after applying variant filters
	const variantJoin = db
		.select({ productId: schema.productVariants.productId, minPrice: min(schema.productVariants.price).as("minPrice"), maxPrice: max(schema.productVariants.price).as("maxPrice") })
		.from(schema.productVariants)
		.where(variantConditions.length ? and(...variantConditions) : undefined)
		.groupBy(schema.productVariants.productId)
		.as("variant_filter");

	// Image subquery (independent): row_number per product to pick primary image later in outer SELECT
	const imagesJoin = db
		.select({
			productId: schema.images.productId,
			url: schema.images.url,
			// ROW_NUMBER() to get the primary image or the first by sortOrder
			rn: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${schema.images.productId} ORDER BY ${schema.images.isPrimary} DESC, ${schema.images.sortOrder} ASC)`.as("rn"),
		})
		.from(schema.images)
		.as("image_filter");

	const rows = await db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			description: schema.genders.label,
			// Get primary image using the rn from imagesJoin
			image: sql<string>`max(case when ${imagesJoin.rn} = 1 then ${imagesJoin.url} else null end)`,
			minPrice: variantJoin.minPrice,
			maxPrice: variantJoin.maxPrice,
		})
		.from(schema.products)
		.innerJoin(schema.genders, eq(schema.products.genderId, schema.genders.id))
		.innerJoin(schema.brands, eq(schema.products.brandId, schema.brands.id))
		.innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
		.innerJoin(variantJoin, eq(variantJoin.productId, schema.products.id))
		// .leftJoin(variantJoin, eq(variantJoin.productId, schema.products.id))
		.leftJoin(imagesJoin, eq(imagesJoin.productId, schema.products.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.groupBy(schema.products.id, schema.products.name, schema.products.createdAt, schema.genders.label, variantJoin.minPrice, variantJoin.maxPrice)
		.orderBy(
			filter?.sort === "price-asc"
				? asc(sql`COALESCE(${variantJoin.minPrice}, 0)`)
				: filter?.sort === "price-desc"
				? desc(sql`COALESCE(${variantJoin.maxPrice}, 0)`)
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

	const products: Product[] = rows.map((row) => ({
		id: row.id,
		name: row.name,
		description: row.description || "",
		image: row.image || "/file.svg",
		price: row.minPrice === row.maxPrice ? Number(row.minPrice) : undefined,
		minPrice: row.minPrice ? Number(row.minPrice) : 0,
		maxPrice: row.maxPrice ? Number(row.maxPrice) : 0,
	}));

	return { products: products, totalCount: Number(totalCountRows[0]?.cnt || 0) };
};

/**
 * Get product by id
 * @param id
 * @returns { ProductDetail | null }
 */
export const getProductById = async (id: string): Promise<ProductDetail | null> => {
	// protect DB from invalid uuid inputs
	if (!isUuid(id)) {
		console.warn(`[getProductById] invalid uuid provided: ${id}`);
		return null;
	}

	const result = await db
		.select({
			id: schema.products.id,
			name: schema.products.name,
			description: schema.products.description,
			isPublished: schema.products.isPublished,
			createdAt: schema.products.createdAt,
			updatedAt: schema.products.updatedAt,
			defaultVariantId: schema.products.defaultVariantId,

			genderId: schema.products.genderId,
			genderLabel: schema.genders.label,
			genderSlug: schema.genders.slug,

			brandId: schema.products.brandId,
			brandName: schema.brands.name,
			brandSlug: schema.brands.slug,

			categoryId: schema.products.categoryId,
			categoryName: schema.categories.name,
			categorySlug: schema.categories.slug,

			image: {
				id: schema.images.id,
				url: schema.images.url,
				isPrimary: schema.images.isPrimary,
				variantId: schema.images.variantId,
			},
			size: {
				id: schema.sizes.id,
				slug: schema.sizes.slug,
				name: schema.sizes.name,
			},
			color: {
				id: schema.colors.id,
				slug: schema.colors.slug,
				name: schema.colors.name,
			},
			variant: {
				id: schema.productVariants.id,
				size: schema.productVariants.size,
				price: schema.productVariants.price,
				salePrice: schema.productVariants.salePrice,
				color: schema.productVariants.color,
				weight: schema.productVariants.weight,
				inStock: schema.productVariants.inStock,
				sku: schema.productVariants.sku,
			},
		})
		.from(schema.products)
		.innerJoin(schema.genders, eq(schema.products.genderId, schema.genders.id))
		.innerJoin(schema.brands, eq(schema.products.brandId, schema.brands.id))
		.innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
		.innerJoin(schema.productVariants, eq(schema.productVariants.productId, schema.products.id))
		.innerJoin(schema.sizes, eq(schema.sizes.id, schema.productVariants.size))
		.innerJoin(schema.colors, eq(schema.colors.id, schema.productVariants.color))
		.innerJoin(schema.images, eq(schema.images.productId, schema.products.id))
		.where(eq(schema.products.id, id));

	if (result.length === 0) {
		return null;
	}

	const productVariantsMap = new Map<string, ProductDetail["variants"][0]>();
	const imagesMap = new Map<string, ProductDetail["images"][0]>();

	result.forEach((row) => {
		if (row.variant && !productVariantsMap.has(row.variant.id)) {
			productVariantsMap.set(row.variant.id, {
				id: row.variant.id,
				size: row.size!.name,
				price: row.variant.price,
				salePrice: row.variant.salePrice,
				color: row.color!.name,
				weight: row.variant.weight ?? 0,
				inStock: row.variant.inStock,
				sku: row.variant.sku,
			});
		}

		if (row.image && !imagesMap.has(row.image.id)) {
			imagesMap.set(row.image.id, {
				id: row.image.id,
				url: row.image.url,
				isPrimary: row.image.isPrimary || false,
				variantId: row.image.variantId || undefined,
			});
		}
	});

	const product: ProductDetail = {
		product: {
			id: result[0].id,
			name: result[0].name,
			description: result[0].description || "",
			categoryId: result[0].categoryId || "",
			genderId: result[0].genderId || "",
			brandId: result[0].brandId || "",
			isPublished: result[0].isPublished || false,
			createdAt: result[0].createdAt || "",
			updatedAt: result[0].updatedAt || "",
			genderLabel: result[0].genderLabel || "",
			genderSlug: result[0].genderSlug || "",
			brandName: result[0].brandName || "",
			brandSlug: result[0].brandSlug || "",
			categoryName: result[0].categoryName || "",
			categorySlug: result[0].categorySlug || "",
			defaultVariantId: result[0].defaultVariantId || "",
		},
		images: Array.from(imagesMap.values()),
		variants: Array.from(productVariantsMap.values()),
	};

	return product;
};

/**
 * Get recommended products excluding the current product
 * @param id
 * @param limit
 * @returns { CardProps[] }
 */
export const getRecommendedProducts = async (id: string, limit: number = 4): Promise<CardProps[]> => {
	// protect DB from invalid uuid inputs
	if (!isUuid(id)) {
		console.warn(`[getRecommendedProducts] invalid uuid provided: ${id}`);
		return [];
	}

	const product = await db
		.select()
		.from(schema.products)
		.where(eq(schema.products.id, id))
		.limit(1)
		.then((res) => res[0]);

	if (!product) {
		return [];
	}

	const variants = db
		.select({
			id: schema.productVariants.id,
			productId: schema.productVariants.productId,
			price: schema.productVariants.price,
			salePrice: schema.productVariants.salePrice,
			sku: schema.productVariants.sku,
		})
		.from(schema.productVariants)
		.where(not(eq(schema.productVariants.productId, id)))
		.limit(limit)
		.as("variants");

	const images = db
		.select({
			id: schema.images.id,
			url: schema.images.url,
			productId: schema.images.productId,
		})
		.from(schema.images)
		.where(not(eq(schema.images.productId, id)))
		.as("images");

	const products = await db
		.select({
			id: schema.products.id,
			variantId: variants.id,
			name: schema.products.name,
			description: schema.products.description,
			image: images.url,
			sku: variants.sku,
			price: variants.price,
			salePrice: variants.salePrice,
			createdAt: schema.products.createdAt,
		})
		.from(schema.products)
		.innerJoin(variants, eq(variants.productId, schema.products.id))
		.innerJoin(images, eq(images.productId, schema.products.id))
		.where(not(eq(schema.products.id, id)))
		.groupBy(schema.products.id, schema.products.name, schema.products.createdAt, images.url, variants.id, variants.price, variants.salePrice, variants.sku)
		.orderBy(sql`RANDOM()`)
		.limit(limit);

	return products.map((product) => ({
		id: product.id,
		variantId: product.variantId,
		name: product.name,
		description: product.description || "",
		image: product.image || "/file.svg",
		price: product.salePrice ? Number(product.salePrice) : Number(product.price),
		sku: product.sku || "",
	}));
};

/**
 * Get reviews by product id
 * @param productId
 * @returns { Review[] }
 */
export const getReviewsByProductId = async (productId: string): Promise<Review[]> => {
	const reviews = await db
		.select({
			id: schema.reviews.id,
			rating: schema.reviews.rating,
			comment: schema.reviews.comment,
			createdAt: schema.reviews.createdAt,
			userId: schema.reviews.userId,
			date: schema.reviews.createdAt,
		})
		.from(schema.reviews)
		.where(eq(schema.reviews.productId, productId))
		.orderBy(desc(schema.reviews.createdAt));

	// Join with users to get user details
	const users = await db
		.select({
			id: schema.users.id,
			name: schema.users.name,
			username: schema.users.username,
		})
		.from(schema.users)
		.where(
			inArray(
				schema.users.id,
				reviews.map((rev) => rev.userId)
			)
		)
		.then((res) => new Map(res.map((user) => [user.id, user])));

	return reviews.map((rev) => ({
		id: rev.id,
		name: users.get(rev.userId)?.name || "",
		username: users.get(rev.userId)?.username || "",
		comment: rev.comment,
		rating: rev.rating,
		date: rev.createdAt.toISOString().split("T")[0],
	}));
};
