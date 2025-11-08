import { pgTable, foreignKey, unique, uuid, timestamp, text, real, numeric, integer, varchar, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const addressType = pgEnum("address_type", ['shipping', 'billing'])
export const orderStatuses = pgEnum("order_statuses", ['pending', 'processing', 'shipped', 'delivered', 'canceled'])


export const sessions = pgTable("sessions", {
	id: uuid().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const accounts = pgTable("accounts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const verifications = pgTable("verifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	parentId: uuid("parent_id"),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const productVariants = pgTable("product_variants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	sku: text().notNull(),
	color: uuid().notNull(),
	size: uuid().notNull(),
	weight: real(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
	inStock: integer("in_stock").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_variants_product_id_products_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.color],
			foreignColumns: [colors.id],
			name: "product_variants_color_colors_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.size],
			foreignColumns: [sizes.id],
			name: "product_variants_size_sizes_id_fk"
		}).onDelete("restrict"),
	unique("product_variants_sku_unique").on(table.sku),
]);

export const cart = pgTable("cart", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	guestId: uuid("guest_id"),
	createdAt: varchar("created_at").notNull(),
	updatedAt: varchar("updated_at").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.guestId],
			foreignColumns: [guests.id],
			name: "cart_guest_id_guests_id_fk"
		}).onDelete("cascade"),
]);

export const guests = pgTable("guests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sessionToken: text("session_token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
});

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	name: text().notNull(),
	age: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const wishlists = pgTable("wishlists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	productId: uuid("product_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "wishlists_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "wishlists_product_id_products_id_fk"
		}).onDelete("cascade"),
]);

export const cartItems = pgTable("cart_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id").notNull(),
	variantId: uuid("variant_id"),
	quantity: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_items_cart_id_cart_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "cart_items_variant_id_product_variants_id_fk"
		}).onDelete("cascade"),
]);

export const sizes = pgTable("sizes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	sortOrder: integer("sort_order").notNull(),
}, (table) => [
	unique("sizes_slug_unique").on(table.slug),
]);

export const colors = pgTable("colors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	hexCode: text("hex_code").notNull(),
}, (table) => [
	unique("colors_slug_unique").on(table.slug),
]);

export const genders = pgTable("genders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	label: text().notNull(),
	slug: text().notNull(),
}, (table) => [
	unique("genders_label_unique").on(table.label),
	unique("genders_slug_unique").on(table.slug),
]);

export const images = pgTable("images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	url: text().notNull(),
	productId: uuid("product_id"),
	variantId: uuid("variant_id"),
	sortOrder: integer("sort_order").default(0).notNull(),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "images_product_id_products_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "images_variant_id_product_variants_id_fk"
		}).onDelete("cascade"),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	status: orderStatuses().default('pending').notNull(),
	shippingAddressId: uuid("shipping_address_id").notNull(),
	billingAddressId: uuid("billing_address_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shippingAddressId],
			foreignColumns: [addresses.id],
			name: "orders_shipping_address_id_addresses_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.billingAddressId],
			foreignColumns: [addresses.id],
			name: "orders_billing_address_id_addresses_id_fk"
		}).onDelete("set null"),
]);

export const orderItems = pgTable("order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	variantId: uuid("variant_id").notNull(),
	quantity: integer().notNull(),
	price: numeric().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "order_items_variant_id_product_variants_id_fk"
		}).onDelete("cascade"),
]);

export const addresses = pgTable("addresses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	street: text().notNull(),
	city: text().notNull(),
	state: text().notNull(),
	postalCode: text("postal_code").notNull(),
	country: text().notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
	type: addressType().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "addresses_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	categoryId: uuid("category_id"),
	genderId: uuid("gender_id"),
	brandId: uuid("brand_id"),
	isPublished: boolean("is_published").default(false).notNull(),
	defaultVariantId: uuid("default_variant_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.genderId],
			foreignColumns: [genders.id],
			name: "products_gender_id_genders_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "products_brand_id_brands_id_fk"
		}).onDelete("set null"),
]);

export const productCollections = pgTable("product_collections", {
	productId: uuid("product_id").notNull(),
	collectionId: uuid("collection_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_collections_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.collectionId],
			foreignColumns: [collections.id],
			name: "product_collections_collection_id_collections_id_fk"
		}),
]);

export const collections = pgTable("collections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("collections_slug_unique").on(table.slug),
]);

export const brands = pgTable("brands", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	logoUrl: text("logo_url"),
}, (table) => [
	unique("brands_name_unique").on(table.name),
	unique("brands_slug_unique").on(table.slug),
]);
