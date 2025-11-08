import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { productVariants } from "../product-variant.model";

export const colors = pgTable("colors", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	hexCode: text("hex_code").notNull(),
});

export const colorRelations = relations(colors, ({ many }) => ({
	productVariants: many(productVariants),
}));

export const insertColorSchema = createInsertSchema(colors);

export const selectColorSchema = createSelectSchema(colors);
