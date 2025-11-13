import { db } from "@/lib/db";
import * as schema from "./index";
import { eq } from "drizzle-orm";
import { join } from "path";
import { readdir } from "fs/promises";

type RGBHex = `#${string}`;

function pick<T>(arr: T[], n: number): T[] {
	const shuffled = arr.slice();
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}
function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

async function seed() {
	try {
		console.log("Seeding filters: genders, colors, sizes");

		// Insert genders
		console.log("Seeding genders");
		const genderRows = [
			{ label: "Men", slug: "men" },
			{ label: "Women", slug: "women" },
			{ label: "Unisex", slug: "unisex" },
		].map((g) => schema.insertGenderSchema.parse(g));

		for (const row of genderRows) {
			const exists = await db.select().from(schema.genders).where(eq(schema.genders.slug, row.slug)).limit(1);
			if (!exists.length) await db.insert(schema.genders).values(row);
		}

		// Insert colors
		console.log("Seeding colors");
		const colorRows = [
			{ name: "Black", slug: "black", hexCode: "#000000" as RGBHex },
			{ name: "White", slug: "white", hexCode: "#FFFFFF" as RGBHex },
			{ name: "Red", slug: "red", hexCode: "#FF0000" as RGBHex },
			{ name: "Blue", slug: "blue", hexCode: "#1E3A8A" as RGBHex },
			{ name: "Green", slug: "green", hexCode: "#10B981" as RGBHex },
			{ name: "Gray", slug: "gray", hexCode: "#6B7280" as RGBHex },
		].map((c) => schema.insertColorSchema.parse(c));

		for (const row of colorRows) {
			const exists = await db.select().from(schema.colors).where(eq(schema.colors.slug, row.slug)).limit(1);
			if (!exists.length) await db.insert(schema.colors).values(row);
		}

		// Insert sizes
		console.log("Seeding sizes");
		const sizeRows = [
			{ name: "7", slug: "7", sortOrder: 0 },
			{ name: "8", slug: "8", sortOrder: 1 },
			{ name: "9", slug: "9", sortOrder: 2 },
			{ name: "10", slug: "10", sortOrder: 3 },
			{ name: "11", slug: "11", sortOrder: 4 },
			{ name: "12", slug: "12", sortOrder: 5 },
		].map((s) => schema.insertSizeSchema.parse(s));
		for (const row of sizeRows) {
			const exists = await db.select().from(schema.sizes).where(eq(schema.sizes.slug, row.slug)).limit(1);
			if (!exists.length) await db.insert(schema.sizes).values(row);
		}

		console.log("Seeding brand: Nike");
		const brand = schema.insertBrandSchema.parse({ name: "Nike", slug: "nike", logoUrl: undefined });
		{
			const exists = await db.select().from(schema.brands).where(eq(schema.brands.slug, brand.slug)).limit(1);
			if (!exists.length) await db.insert(schema.brands).values(brand);
		}

		console.log("Seeding categories");
		const catRows = [
			{ name: "Shoes", slug: "shoes", parentId: null },
			{ name: "Running Shoes", slug: "running-shoes", parentId: null },
			{ name: "Lifestyle", slug: "lifestyle", parentId: null },
		].map((c) => schema.insertCategorySchema.parse(c));
		for (const row of catRows) {
			const exists = await db.select().from(schema.categories).where(eq(schema.categories.slug, row.slug)).limit(1);
			if (!exists.length) await db.insert(schema.categories).values(row);
		}

		console.log("Seeding collections");
		const collectionRows = [schema.insertCollectionSchema.parse({ name: "Summer '25", slug: "summer-25" }), schema.insertCollectionSchema.parse({ name: "New Arrivals", slug: "new-arrivals" })];
		for (const row of collectionRows) {
			const exists = await db.select().from(schema.collections).where(eq(schema.collections.slug, row.slug)).limit(1);
			if (!exists.length) await db.insert(schema.collections).values(row);
		}

		console.log("Seeding products and variants");

		// get all filters
		const allGenders = await db.select().from(schema.genders);
		const allColors = await db.select().from(schema.colors);
		const allSizes = await db.select().from(schema.sizes);

		// Get brand
		const nike = (await db.select().from(schema.brands).where(eq(schema.brands.slug, "nike")))[0];

		// Get categories
		const shoesCat = (await db.select().from(schema.categories).where(eq(schema.categories.slug, "shoes")))[0];
		const runningCat = (await db.select().from(schema.categories).where(eq(schema.categories.slug, "running-shoes")))[0];
		const lifestyleCat = (await db.select().from(schema.categories).where(eq(schema.categories.slug, "lifestyle")))[0];

		// Get collections
		const summer = (await db.select().from(schema.collections).where(eq(schema.collections.slug, "summer-25")))[0];
		const newArrivals = (await db.select().from(schema.collections).where(eq(schema.collections.slug, "new-arrivals")))[0];

		// Read images from public/shoes
		const sourceDir = join(process.cwd(), "public", "shoes");
        
        // Create product names based on available image names in public/shoes
		const productNames = (await readdir(sourceDir)).map((file) => {
            const name = file.replace(/\.[^/.]+$/, ""); // Remove file extension
            return name.split("+").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" "); // Capitalize words
        });

		// For each product name, create product, variants, and images
		for (const productName of productNames) {
			const product = schema.insertProductSchema.parse({
				name: productName,
				description: `Description for ${productName}`,
				categoryId: [shoesCat, runningCat, lifestyleCat][Math.floor(Math.random() * 3)].id,
				genderId: allGenders[Math.floor(Math.random() * allGenders.length)].id,
				brandId: nike.id,
				isPublished: true,
				collectionId: summer.id,
			});

			// Insert the product into the database and get the inserted record
			const retP = await db.insert(schema.products).values(product).returning();
			const insertedProduct = retP[0];
			const colorChoices = pick(allColors, randInt(2, Math.min(4, allColors.length)));
			const sizeChoices = pick(allSizes, randInt(3, Math.min(6, allSizes.length)));

			const variantProducts: string[] = [];
			let defaultVariantId: string | null = null;

			// Create a variant for each combination of color and size
			for (const color of colorChoices) {
				for (const size of sizeChoices) {
					const variant = schema.insertProductVariantSchema.parse({
						productId: insertedProduct.id,
						color: color.id,
						size: size.id,
						weight: Math.random() * 2 + 0.5,
						price: Number(Math.random() * 100 + 50).toFixed(2),
						salePrice: Math.random() < 0.3 ? (Math.random() * 50 + 30).toFixed(2) : undefined,
						inStock: randInt(20, 100),
                        sku: `SKU-${insertedProduct.id.slice(0, 8).toUpperCase()}-${color.slug.toUpperCase()}-${size.slug.toUpperCase()}`,
					});
					const retV = await db.insert(schema.productVariants).values(variant).returning();
					const insertedVariant = retV[0];
					variantProducts.push(insertedVariant.id);
					if (!defaultVariantId) {
						defaultVariantId = insertedVariant.id;
					}
				}
			}

			if (defaultVariantId) {
				await db.update(schema.products).set({ defaultVariantId }).where(eq(schema.products.id, insertedProduct.id));
			}

			const pickName = (name: string) => name.replace(/\s/g, "+").toUpperCase();
			const images = schema.insertImageSchema.parse({
				url: "/shoes/" + pickName(productName) + ".avif",
				productId: insertedProduct.id,
				isPrimary: true,
				sortOrder: 0,
			});

			await db.insert(schema.images).values(images);

			// Assign collections to product
			const collectionsForProduct: { id: string }[] = Math.random() < 0.5 ? [summer] : ([newArrivals, summer].filter(Boolean) as { id: string }[]);
			for (const col of collectionsForProduct) {
				await db.insert(schema.productCollections).values({
					productId: insertedProduct.id,
					collectionId: col.id,
				});
			}
			console.log(`Seeded product: ${productName} with ${variantProducts.length} variants.`);
		}
		console.log("Database seeding completed.");
	} catch (error) {
		console.error("Error seeding database:", error);
        process.exit(1);
	}
}

seed();
