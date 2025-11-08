import { pgTable, uuid, text, foreignKey } from "drizzle-orm/pg-core";
import { z } from "zod";
import { products } from "./product.model";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		description: text("description"),
		slug: text("slug").notNull().unique(),
		parentId: uuid("parent_id"),
	},
	(table) => [
		{
			// Self-referential foreign key for parent category
			foreignKeyParent: foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }).onDelete("set null"),
		},
	]
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
	products: many(products),
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
	}),
	children: many(categories, {
		relationName: "categories_parent",
	}),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const selectCategorySchema = createSelectSchema(categories);
