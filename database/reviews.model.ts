import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { products, users } from "./index";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const reviews = pgTable(
	"reviews",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
		rating: integer("rating").notNull(),
		comment: text("comment").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	() => [{ ratingRange: sql`CHECK (rating >= 1 AND rating <= 5)` }]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id],
	}),
}));

export const insertReviewSchema = createInsertSchema(reviews);

export const selectReviewSchema = createSelectSchema(reviews);
