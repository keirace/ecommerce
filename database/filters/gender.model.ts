
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../product.model";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const genders = pgTable("genders", {
    id: uuid("id").primaryKey().defaultRandom(),
    label: text("label").notNull().unique(),
    slug: text("slug").notNull().unique(),
})

export const genderRelations = relations(genders, ({ many }) => ({
    products: many(products),
}))

export const insertGenderSchema = createInsertSchema(genders);

export const selectGenderSchema = createSelectSchema(genders);