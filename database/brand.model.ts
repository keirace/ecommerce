import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from "./index";

export const brands = pgTable("brands", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	logoUrl: text("logo_url"),
});

export const brandRelations = relations(brands, ({ many }) => ({
	products: many(products),
}));

export const insertBrandSchema = createInsertSchema(brands);

export const selectBrandSchema = createSelectSchema(brands);