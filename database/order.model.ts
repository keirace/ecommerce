import { pgTable, uuid, timestamp, numeric, integer, pgEnum } from "drizzle-orm/pg-core";
import { users, productVariants, addresses } from "./index";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const orderStatuses = pgEnum("order_statuses", ["pending", "processing", "shipped", "delivered", "canceled"]);

export const orders = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
	status: orderStatuses("status").notNull().default("pending"),
	shippingAddressId: uuid("shipping_address_id")
		.notNull()
		.references(() => addresses.id, { onDelete: "set null" }),
	billingAddressId: uuid("billing_address_id")
		.notNull()
		.references(() => addresses.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	variantId: uuid("variant_id")
		.notNull()
		.references(() => productVariants.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull(),
	price: numeric("price").notNull(),
});

export const orderRelations = relations(orders, ({ one, many }) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id],
	}),
	shippingAddress: one(addresses, {
		fields: [orders.shippingAddressId],
		references: [addresses.id],
	}),
	billingAddress: one(addresses, {
		fields: [orders.billingAddressId],
		references: [addresses.id],
	}),
	items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
	variant: one(productVariants, {
		fields: [orderItems.variantId],
		references: [productVariants.id],
	}),
}));

export const insertOrderSchema = z.object({
	userId: z.uuid(),
	totalAmount: z.number().min(0),
	status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).optional().default("pending"),
	shippingAddressId: z.uuid(),
	billingAddressId: z.uuid(),
	createdAt: z.date().optional(),
});

export const selectOrderSchema = insertOrderSchema.extend({
	id: z.uuid(),
});

export const orderItemSchema = z.object({
	orderId: z.uuid(),
	variantId: z.uuid(),
	quantity: z.number().min(1),
	price: z.number().min(0),
});

export const orderItemSelectSchema = orderItemSchema.extend({
	id: z.uuid(),
});

export type Order = z.infer<typeof selectOrderSchema>;
export type OrderSelect = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderItemSelect = z.infer<typeof orderItemSelectSchema>;
