import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productVariants, users, guests } from "./index";
import { z } from "zod";

export const cart = pgTable("cart", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	guestId: uuid("guest_id").references(() => guests.id, { onDelete: "cascade" }),
	createdAt: varchar("created_at").notNull(),
	updatedAt: varchar("updated_at").notNull(),
});

export const cartItems = pgTable("cart_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	cartId: uuid("cart_id")
		.notNull()
		.references(() => cart.id, { onDelete: "cascade" }),
	variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
	quantity: varchar("quantity").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const cartRelationships = relations(cart, ({ one, many }) => ({
	user: one(users, {
		fields: [cart.userId],
		references: [users.id],
	}),
	guest: one(guests, {
		fields: [cart.guestId],
		references: [guests.id],
	}),
	items: many(cartItems),
}));

export const cartItemRelationships = relations(cartItems, ({ one }) => ({
    cart: one(cart, {
        fields: [cartItems.cartId],
        references: [cart.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.variantId],
        references: [productVariants.id],
    }),
}));

export const insertCartSchema = z.object({
    userId: z.uuid().optional(),
    guestId: z.uuid().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const selectCartSchema = insertCartSchema.extend({
    id: z.uuid(),
});

export const insertCartItemSchema = z.object({
    cartId: z.uuid(),
    variantId: z.uuid(),
    quantity: z.number().min(1),
});

export const selectCartItemSchema = insertCartItemSchema.extend({
    id: z.uuid(),
});

export type Cart = z.infer<typeof insertCartSchema>;
export type CartSelect = z.infer<typeof selectCartSchema>;
export type CartItem = z.infer<typeof insertCartItemSchema>;
export type CartItemSelect = z.infer<typeof selectCartItemSchema>;