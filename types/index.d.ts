type Product = {
	id: string;
	name: string;
	description: string;
	meta?: string | string[];
	gender: "men" | "women" | "unisex";
	sizes: string[];
	colors: string[];
	price: number;
	image: string;
	createdAt: string;
	badge?: { label: string; tone?: "red" | "green" | "orange" };
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
