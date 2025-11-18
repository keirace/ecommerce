import { pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./product.model";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const collections = pgTable("collections", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	created_at: timestamp("created_at").defaultNow(),
});

export const productCollections = pgTable(
	"product_collections",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id),
		collectionId: uuid("collection_id")
			.notNull()
			.references(() => collections.id),
	},
	(table) => [
		{
			// Define the primary key for the product_collections table
			pk: primaryKey({ columns: [table.productId, table.collectionId] }),
		},
	]
);

export const insertCollectionSchema = createInsertSchema(collections);

export const selectCollectionSchema = createSelectSchema(collections);
