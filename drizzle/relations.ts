import { relations } from "drizzle-orm/relations";
import { users, sessions, accounts, products, productVariants, colors, sizes, cart, guests, wishlists, cartItems, images, orders, addresses, orderItems, categories, genders, brands, productCollections, collections } from "./schema";

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	carts: many(cart),
	wishlists: many(wishlists),
	orders: many(orders),
	addresses: many(addresses),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const productVariantsRelations = relations(productVariants, ({one, many}) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id]
	}),
	color: one(colors, {
		fields: [productVariants.color],
		references: [colors.id]
	}),
	size: one(sizes, {
		fields: [productVariants.size],
		references: [sizes.id]
	}),
	cartItems: many(cartItems),
	images: many(images),
	orderItems: many(orderItems),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productVariants: many(productVariants),
	wishlists: many(wishlists),
	images: many(images),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	gender: one(genders, {
		fields: [products.genderId],
		references: [genders.id]
	}),
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id]
	}),
	productCollections: many(productCollections),
}));

export const colorsRelations = relations(colors, ({many}) => ({
	productVariants: many(productVariants),
}));

export const sizesRelations = relations(sizes, ({many}) => ({
	productVariants: many(productVariants),
}));

export const cartRelations = relations(cart, ({one, many}) => ({
	user: one(users, {
		fields: [cart.userId],
		references: [users.id]
	}),
	guest: one(guests, {
		fields: [cart.guestId],
		references: [guests.id]
	}),
	cartItems: many(cartItems),
}));

export const guestsRelations = relations(guests, ({many}) => ({
	carts: many(cart),
}));

export const wishlistsRelations = relations(wishlists, ({one}) => ({
	user: one(users, {
		fields: [wishlists.userId],
		references: [users.id]
	}),
	product: one(products, {
		fields: [wishlists.productId],
		references: [products.id]
	}),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	cart: one(cart, {
		fields: [cartItems.cartId],
		references: [cart.id]
	}),
	productVariant: one(productVariants, {
		fields: [cartItems.variantId],
		references: [productVariants.id]
	}),
}));

export const imagesRelations = relations(images, ({one}) => ({
	product: one(products, {
		fields: [images.productId],
		references: [products.id]
	}),
	productVariant: one(productVariants, {
		fields: [images.variantId],
		references: [productVariants.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	address_shippingAddressId: one(addresses, {
		fields: [orders.shippingAddressId],
		references: [addresses.id],
		relationName: "orders_shippingAddressId_addresses_id"
	}),
	address_billingAddressId: one(addresses, {
		fields: [orders.billingAddressId],
		references: [addresses.id],
		relationName: "orders_billingAddressId_addresses_id"
	}),
	orderItems: many(orderItems),
}));

export const addressesRelations = relations(addresses, ({one, many}) => ({
	orders_shippingAddressId: many(orders, {
		relationName: "orders_shippingAddressId_addresses_id"
	}),
	orders_billingAddressId: many(orders, {
		relationName: "orders_billingAddressId_addresses_id"
	}),
	user: one(users, {
		fields: [addresses.userId],
		references: [users.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	productVariant: one(productVariants, {
		fields: [orderItems.variantId],
		references: [productVariants.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const gendersRelations = relations(genders, ({many}) => ({
	products: many(products),
}));

export const brandsRelations = relations(brands, ({many}) => ({
	products: many(products),
}));

export const productCollectionsRelations = relations(productCollections, ({one}) => ({
	product: one(products, {
		fields: [productCollections.productId],
		references: [products.id]
	}),
	collection: one(collections, {
		fields: [productCollections.collectionId],
		references: [collections.id]
	}),
}));

export const collectionsRelations = relations(collections, ({many}) => ({
	productCollections: many(productCollections),
}));