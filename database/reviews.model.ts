import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { products } from "./product.model";
import { users } from "./user.model";
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

export const insertReviewSchema = createInsertSchema(reviews);

export const selectReviewSchema = createSelectSchema(reviews);
