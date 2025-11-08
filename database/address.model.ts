import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing"]);

export const addresses = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	street: text("street").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	postalCode: text("postal_code").notNull(),
	country: text("country").notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
	type: addressTypeEnum("type").notNull()
});

export const addressRelations = relations(addresses, ({ one }) => ({
    user: one(users, {
        fields: [addresses.userId],
        references: [users.id],
    }),
}));

// Zod schema for inserting a new address
export const insertAddressSchema = createInsertSchema(addresses);

// Schema for selecting address with id
export const selectAddressSchema = createSelectSchema(addresses);