import { pgTable, uuid, timestamp, integer, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	username: text("username").unique(),
	displayUsername: text("display_username"),
	email: text("email").unique().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	name: text("name").notNull(),
	age: integer("age"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const insertUserSchema = createInsertSchema(users);

export const selectUserSchema = createSelectSchema(users);
