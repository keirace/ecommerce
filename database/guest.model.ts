import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const guests = pgTable("guests", {
	id: uuid("id").primaryKey().defaultRandom(),
	sessionToken: text("session_token").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});

export const guestInsertSchema = createInsertSchema(guests);
export const guestSelectSchema = createSelectSchema(guests);
