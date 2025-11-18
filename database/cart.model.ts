import { pgTable, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { productVariants } from './product-variant.model';
import { users } from "./user.model";
import { guests } from "./guest.model";
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const cart = pgTable("cart", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	guestId: uuid("guest_id").references(() => guests.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	cartId: uuid("cart_id")
		.notNull()
		.references(() => cart.id, { onDelete: "cascade" }),
	variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCartSchema = createInsertSchema(cart);
export const selectCartSchema = createSelectSchema(cart);

export const insertCartItemSchema = createInsertSchema(cartItems);
export const selectCartItemSchema = createSelectSchema(cartItems);
// export const insertCartSchema = z.object({
//     userId: z.uuid().optional(),
//     guestId: z.uuid().optional(),
//     createdAt: z.date().,
//     updatedAt: z.date(),
// });

// export const selectCartSchema = insertCartSchema.extend({
//     id: z.uuid(),
// });

// export const insertCartItemSchema = z.object({
//     cartId: z.uuid(),
//     variantId: z.uuid(),
//     quantity: z.number().min(1),
// });

// export const selectCartItemSchema = insertCartItemSchema.extend({
//     id: z.uuid(),
// });

// export type Cart = z.infer<typeof insertCartSchema>;
// export type CartSelect = z.infer<typeof selectCartSchema>;
// export type CartItem = z.infer<typeof insertCartItemSchema>;
// export type CartItemSelect = z.infer<typeof selectCartItemSchema>;