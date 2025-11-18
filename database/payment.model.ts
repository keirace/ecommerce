import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { orders } from "./order.model";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const paymentMethodEnum = pgEnum("payment_method", ["credit_card", "paypal", "bank_transfer", "cash_on_delivery"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed"]);

export const payments = pgTable("payments", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	paymentIntentId: text("payment_intent_id").notNull().unique(),
	method: paymentMethodEnum("method").notNull(),
	status: paymentStatusEnum("status").notNull().default("pending"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments);

export const selectPaymentSchema = createSelectSchema(payments);

