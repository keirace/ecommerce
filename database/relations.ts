import { relations } from "drizzle-orm";
import { products } from "./product.model";
import { colors } from "./filters/color.model";
import { reviews } from "./reviews.model";
import { sizes } from "./filters/size.model";
import { cart, cartItems } from "./cart.model";
import { guests } from "./guest.model";
import { orders, orderItems } from "./order.model";
import { addresses } from "./address.model";
import { payments } from "./payment.model";
import { productVariants } from "./product-variant.model";
import { users } from "./user.model";
import { wishlists } from "./wishlist.model";
import { images } from "./image.model";
import { genders } from "./filters/gender.model";
import { categories } from "./category.model";
import { brands } from "./brand.model";
import { collections } from "./collection.model";


export const genderRelations = relations(genders, ({ many }) => ({
	products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	genders: one(genders, {
		fields: [products.genderId],
		references: [genders.id],
	}),
	brands: one(brands, {
		fields: [products.brandId],
		references: [brands.id],
	}),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id],
	}),
}));

export const sizeRelations = relations(sizes, ({ many }) => ({
	productVariants: many(productVariants),
}));

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

export const colorRelations = relations(colors, ({ many }) => ({
	productVariants: many(productVariants),
}));

export const brandRelations = relations(brands, ({ many }) => ({
	products: many(products),
}));

export const collectionRelations = relations(collections, ({ many }) => ({
	products: many(products),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
	order: one(orders, {
		fields: [payments.orderId],
		references: [orders.id],
	}),
}));

export const imageRelations = relations(images, ({ one }) => ({
    product: one(products, {
        fields: [images.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [images.variantId],
        references: [productVariants.id],
    }),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
    products: many(products),
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
    }),
    children: many(categories, {
        relationName: "categories_parent",
    }),
}));

export const addressRelations = relations(addresses, ({ one }) => ({
    user: one(users, {
        fields: [addresses.userId],
        references: [users.id],
    }),
}));


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

export const wishlistRelationships = relations(wishlists, ({ one }) => ({
    user: one(users, {
        fields: [wishlists.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [wishlists.productId],
        references: [products.id],
    }),
}));


export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    color: one(colors, {
        fields: [productVariants.color],
        references: [colors.id],
    }),
    size: one(sizes, {
        fields: [productVariants.size],
        references: [sizes.id],
    }),
    orderItems: many(orderItems),
    cartItems: many(cartItems),
    images: many(images),
}));
