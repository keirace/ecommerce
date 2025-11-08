import { pgTable, uuid, text, integer,  } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productVariants } from "../product-variant.model";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const sizes = pgTable("sizes", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
    sortOrder: integer("sort_order").notNull(),
});

export const sizeRelations = relations(sizes, ({ many }) => ({
    productVariants: many(productVariants),
}));

export const insertSizeSchema = createInsertSchema(sizes);

export const selectSizeSchema = createSelectSchema(sizes);