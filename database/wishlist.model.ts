import { pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { products } from "./product.model";
import { users } from "./user.model";
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
