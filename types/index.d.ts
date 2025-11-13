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
	gender?: string;
	sizes?: string[];
	colors?: string[];
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
