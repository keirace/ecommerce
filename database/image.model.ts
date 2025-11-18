import { pgTable, uuid, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { products } from "./product.model";
import { productVariants } from './product-variant.model';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const images = pgTable("images", {
	id: uuid("id").primaryKey().defaultRandom(),
	url: text("url").notNull(),
	productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
	variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
	sortOrder: integer("sort_order").default(0).notNull(),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const insertImageSchema = createInsertSchema(images);

export const selectImageSchema = createSelectSchema(images);
