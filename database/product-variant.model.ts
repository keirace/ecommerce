import { pgTable, uuid, text, integer, timestamp, numeric, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products, colors, sizes, images, cartItems, orderItems } from "./index"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const productVariants = pgTable("product_variants", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	sku: text("sku").notNull().unique(),
	color: uuid("color").notNull().references(() => colors.id, { onDelete: "restrict" }),
	size: uuid("size").notNull().references(() => sizes.id, { onDelete: "restrict" }),
	weight: real("weight"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
	inStock: integer("in_stock").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id],
	}),
	color: one(colors, {
		fields: [productVariants.color],
		references: [colors.id],
	}),
	size: one(sizes, {
		fields: [productVariants.size],
		references: [sizes.id],
	}),
	orderItems: many(orderItems),
	cartItems: many(cartItems),
    images: many(images),
}));

export const insertProductVariantSchema = createInsertSchema(productVariants);

export const selectProductVariantSchema = createSelectSchema(productVariants);