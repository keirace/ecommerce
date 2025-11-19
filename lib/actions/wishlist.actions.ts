"use server";
import { db } from "../db";
import * as schema from "@/database/index";
import { eq, and } from "drizzle-orm";

export const addProductToFavorites = async (productId: string | number, userId: string) => {
	try {
		const existing = await db
			.select()
			.from(schema.wishlists)
			.where(and(eq(schema.wishlists.productId, productId.toString()), eq(schema.wishlists.userId, userId)))
			.limit(1);

		console.log("Existing favorites check:", existing);
		if (existing.length > 0) {
			console.log("Product already in favorites:", productId);
			return { ok: false };
		}
		await db.insert(schema.wishlists).values({
			userId,
			productId: productId.toString(),
		});
		return { ok: true };
	} catch (error) {
		console.error("Error adding product to favorites:", error);
	}
};

export const removeProductFromFavorites = async (productId: string, userId: string) => {
	try {
		await db.delete(schema.wishlists).where(and(eq(schema.wishlists.productId, productId), eq(schema.wishlists.userId, userId)));
	} catch (error) {
		console.error("Error removing product from favorites:", error);
	}
};

export const fetchUserFavorites = async (userId: string): Promise<CardProps[]> => {
	try {
		const favorites = await db
			.select({
				name: schema.products.name,
				description: schema.products.description,
				image: schema.images.url,
				id: schema.products.id,
				price: schema.productVariants.price,
				salePrice: schema.productVariants.salePrice,
			})
			.from(schema.wishlists)
			.where(eq(schema.wishlists.userId, userId))
			.innerJoin(schema.products, eq(schema.products.id, schema.wishlists.productId))
			.innerJoin(schema.productVariants, eq(schema.productVariants.productId, schema.products.id))
			.innerJoin(schema.images, and(eq(schema.images.variantId, schema.productVariants.id), eq(schema.images.isPrimary, true)));

		return favorites.map((item) => ({
			id: item.id || "",
			name: item.name || "Unnamed Product",
			description: item.description,
			image: item.image || "/file.svg",
			price: item.price ? Number(item.price) : 0,
			salePrice: item.salePrice ? Number(item.salePrice) : null,
		}));
	} catch (error) {
		console.error("Error fetching user favorites:", error);
		return [];
	}
};
