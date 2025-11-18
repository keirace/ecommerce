"use server";
import { db } from "@/lib/db";
import * as schema from "@/database/index";
import { eq, and, SQL, desc, sql } from "drizzle-orm";
import { ensureGuestSession } from "@/app/(root)/products/[id]/page";
import { getCurrentUser } from "@/lib/actions/auth.actions";

export const addProductToCart = async (selectedVariant: Variant | null) => {
	if (!selectedVariant) return;

	const userResp = await getCurrentUser();
    let cartId: string | null = null;

	if (userResp.ok) {
		console.log("User is logged in with userId:", userResp.user?.id);
        // Get or create cart
        const cart = await getCart(userResp.user?.id || null, null);
        cartId = cart?.id;
        if (!cartId) {
            cartId = await createCart(userResp.user?.id || null, null);
            console.log("Created new cart with id:", cartId);
        } else {
            console.log("Using existing cart with id:", cartId);
        }
	} else {
		console.log("User not logged in, ensuring guest session");
		const data = await ensureGuestSession();

		console.log("Guest session data on add to cart:", data);
		if (!data.ok || !data.sessionToken) {
			console.error("Failed to ensure guest session");
			return;
		}
        
        // fetch guest id
		const guestId = await db
			.select({ id: schema.guests.id })
			.from(schema.guests)
			.where(eq(schema.guests.sessionToken, data.sessionToken))
			.limit(1)
			.then((res) => res[0]?.id || null);
		console.log("Fetched guestId:", guestId);

		// Get or create cart
		const cart = await getCart(null, guestId);
		let cartId = cart?.id;
		if (!cartId) {
			cartId = await createCart(null, guestId);
			console.log("Created new cart with id:", cartId);
		} else {
			console.log("Using existing cart with id:", cartId);
		}
	}
    // Ensure cartId is set
    if (!cartId) {
        console.error("Cart ID is not available");
        return;
    }

	// Add item to cart
	await addCartItem(cartId, selectedVariant.id, 1);
	console.log(`Added variant ${selectedVariant.id} to cart ${cartId}`);
};

export const getCart = async (userId: string | null, guestId: string | null) => {
	let cart;
	if (userId) {
		console.info(`[getCart] fetching cart for userId: ${userId}`);
		cart = await db
			.select()
			.from(schema.cart)
			.where(eq(schema.cart.userId, userId))
			.limit(1)
			.then((res) => res[0]);
	} else if (guestId) {
		console.info(`[getCart] fetching cart for guestId: ${guestId}`);
		cart = await db
			.select()
			.from(schema.cart)
			.where(eq(schema.cart.guestId, guestId))
			.limit(1)
			.then((res) => res[0]);
	} else {
		throw new Error("Either userId or guestId must be provided to fetch a cart.");
	}
	return cart;
};

export const createCart = async (userId: string | null, guestId: string | null): Promise<string> => {
	if (!userId && !guestId) {
		throw new Error("Either userId or guestId must be provided to create a cart.");
	}
	let result;
	if (userId) {
		console.info(`[createCart] Creating cart for userId: ${userId}`);
		result = await db.insert(schema.cart).values({ userId: userId }).returning({ id: schema.cart.id });
	} else if (guestId) {
		console.info(`[createCart] Creating cart for guestId: ${guestId}`);
		result = await db.insert(schema.cart).values({ guestId: guestId }).returning({ id: schema.cart.id });
	}
	return result![0]?.id || "";
};

export const addCartItem = async (cartId: string, variantId: string, quantity: number): Promise<void> => {
	const conditions: SQL[] = [];
	conditions.push(eq(schema.cartItems.cartId, cartId));
	conditions.push(eq(schema.cartItems.variantId, variantId));

	// Check if the cart item already exists
	const existingItem = await db
		.select()
		.from(schema.cartItems)
		.where(and(...conditions))
		.limit(1)
		.then((res) => res[0]);

	if (existingItem) {
		// If the item exists, update the quantity
		await db
			.update(schema.cartItems)
			.set({ quantity: existingItem.quantity + quantity })
			.where(eq(schema.cartItems.id, existingItem.id));
	} else {
		// If the item doesn't exist, add a new item
		const parsedItem = schema.insertCartItemSchema.parse({ cartId, variantId, quantity });
		await db.insert(schema.cartItems).values(parsedItem);
	}
};

export const getCartItems = async (cartId: string): Promise<CartItemProps[]> => {
	const items = await db
		.select({
			id: schema.cartItems.id,
			name: schema.products.name,
			quantity: schema.cartItems.quantity,
			price: schema.productVariants.price,
			salePrice: schema.productVariants.salePrice,
			description: schema.products.description,
			color: schema.colors.name,
			size: schema.sizes.name,
			image: schema.images.url,
		})
		.from(schema.cartItems)
		.leftJoin(schema.productVariants, eq(schema.cartItems.variantId, schema.productVariants.id))
		.leftJoin(schema.products, eq(schema.productVariants.productId, schema.products.id))
		.leftJoin(schema.colors, eq(schema.productVariants.color, schema.colors.id))
		.leftJoin(schema.sizes, eq(schema.productVariants.size, schema.sizes.id))
		.leftJoin(schema.images, and(eq(schema.images.productId, schema.products.id), eq(schema.images.isPrimary, true)))
		.where(eq(schema.cartItems.cartId, cartId));

	const result: CartItemProps[] = items.map((item) => {
		return {
			id: item.id,
			name: item.name || "Unnamed Product",
			quantity: item.quantity,
			price: item.price ? Number(item.price) : 0,
			salePrice: item.salePrice ? Number(item.salePrice) : null,
			description: item.description,
			color: item.color || "Unknown Color",
			size: item.size || "Unknown Size",
			image: item.image ?? "/file.svg",
		};
	});
	return result;
};

export const removeCartItem = async (cartItemId: string | number, quantity: number): Promise<void> => {
	if (quantity > 1) {
		// Decrease quantity by 1
		await db
			.update(schema.cartItems)
			.set({ quantity: sql`${schema.cartItems.quantity} - 1` })
			.where(eq(schema.cartItems.id, String(cartItemId)));
		return;
	}
	// Remove the cart item
	await db.delete(schema.cartItems).where(eq(schema.cartItems.id, String(cartItemId)));
};

export const incrementCartItemQuantity = async (cartItemId: string | number, incrementBy: number): Promise<void> => {
	await db
		.update(schema.cartItems)
		.set({ quantity: sql`${schema.cartItems.quantity} + ${incrementBy}` })
		.where(eq(schema.cartItems.id, String(cartItemId)));
};
