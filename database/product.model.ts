import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories, genders, brands } from "./index";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const products = pgTable("products", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
	genderId: uuid("gender_id").references(() => genders.id, { onDelete: "set null" }),
	brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
	isPublished: boolean("is_published").notNull().default(false),
	defaultVariantId: uuid("default_variant_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	genders: one(genders, {
		fields: [products.genderId],
		references: [genders.id],
	}),
	brands: one(brands, {
		fields: [products.brandId],
		references: [brands.id],
	}),
}));

export const insertProductSchema = createInsertSchema(products);

export const selectProductSchema = createSelectSchema(products);