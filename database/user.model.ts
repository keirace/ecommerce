import { pgTable, uuid, timestamp, integer, text, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid().primaryKey(),
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
