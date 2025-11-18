type Product = {
	id: string;
	name: string;
	description: string | null;
	meta?: string | string[];
	minPrice: number;
	maxPrice: number;
	// gender: "men" | "women" | "unisex";
	// sizes: string[];
	// colors: string[];
	// price: number;
	image: string;
	// createdAt: string;
	badge?: { label: string; tone?: "red" | "green" | "orange" };
};

type CardProps = {
	name: string;
	description: string | null;
	image: string;
	id: string;
	variantId?: string;
	createdAt?: string;
	price: string | number;
	meta?: string | string[];
	badge?: { label: string; tone?: "orange" | "red" | "green" };
};

type Brand = {
	id: string;
	name: string;
	slug: string;
	logoUrl?: string;
};

type Category = {
	id: string;
	name: string;
	slug: string;
};

type Gender = {
	id: string;
	name: string;
	slug: string;
};

type User = {
	id: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
};

type Session = {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string;
	userAgent?: string;
	userId: string;
};

type NormalizedProductFilters = {
	search?: string;
	categories?: string[];
	genders?: string[];
	colors?: string[];
	sizes?: string[];
	brands?: string[];
	minPrice?: string;
	maxPrice?: string;
	sort?: "price-asc" | "price-desc" | "newest";
	pages?: number;
	limit?: number;
};

type ProductDetail = {
	product: {
		id: string;
		name: string;
		description: string;
		categoryId: string;
		genderId: string | null;
		brandId: string | null;
		isPublished: boolean;
		defaultVariantId: string | null;
		createdAt: Date;
		updatedAt: Date;

		genderLabel: string | null;
		genderSlug: string | null;

		brandName: string | null;
		brandSlug: string | null;

		categoryName: string | null;
		categorySlug: string | null;
	},

	variants: {
		id: string;
		size: string;
		price: string | null;
		salePrice?: string | null;
		color: string;
		weight: number;
		inStock: number;
		sku: string;
	}[],

	images: {
		id: string;
		url: string;
		isPrimary: boolean;
		variantId?: string;
	}[],
};

type Review = {
	id: string;
	username: string;
    name: string;
    comment: string;
    rating: number;
    date: string;
};

type Variant = {
    id: string;
    size: string;
    price: string | null;
    salePrice?: string | null | undefined;
    color: string;
    weight: number;
    inStock: number;
    sku: string;
}

type CartItemProps = {
    id: string | number;
    name: string;
    description: string | null;
    image: string;
    price: number;
    salePrice: number | null;
    color: string;
    size: string;
	quantity: number;
}