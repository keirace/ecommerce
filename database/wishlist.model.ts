import { pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products, users } from "./index";
import { z } from "zod";

export const wishlists = pgTable(
	"wishlists",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }).notNull(),
		productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		{
			// Prevent a user from adding the same product to their wishlist multiple times
			uniqueUserProduct: uniqueIndex("wishlists_user_product_unique").on(table.userId, table.productId),
		},
	]
);

export const wishlistRelationships = relations(wishlists, ({ one }) => ({
	user: one(users, {
		fields: [wishlists.userId],
		references: [users.id],
	}),
	product: one(products, {
		fields: [wishlists.productId],
		references: [products.id],
	}),
}));

export const insertWishlistSchema = z.object({
	userId: z.uuid(),
	productId: z.uuid().optional(),
	createdAt: z.date().optional(),
});

export const selectWishlistSchema = insertWishlistSchema.extend({
	id: z.uuid(),
});

export type Wishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistSelect = z.infer<typeof selectWishlistSchema>;
