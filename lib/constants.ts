export const MOCK_PRODUCTS = [
	{
		id: 1,
		title: "Air Jordan 1 Mid SE",
		subtitle: "Men's Shoes",
		meta: "6 Colour",
		price: 149.99,
		imageSrc: "/shoes/AIR+JORDAN+1+MID+SE.avif",
		badge: { label: "Just In", tone: "orange" as const },
	},
	{
		id: 2,
		title: "Air Jordan 1 Low SE",
		subtitle: "Men's Shoes",
		meta: "4 Colour",
		price: 129.99,
		imageSrc: "/shoes/AIR+JORDAN+1+LOW+SE.avif",
		badge: { label: "Best Seller", tone: "red" as const },
	},
	{
		id: 3,
		title: "Air Jordan 1 Retro High OG \"Pro Green\"",
		subtitle: "Women's Shoes",
		meta: "6 Colour",
		price: 189.99,
		imageSrc: "/shoes/WMNS+AIR+JORDAN+1+RETRO+HI+OG.avif",
		badge: { label: "Trending", tone: "green" as const },
	},
	{
		id: 4,
		title: "Air Jordan 1 Low SE",
		subtitle: "Women's Shoes",
		meta: "3 Colour",
		price: 139.99,
		imageSrc: "/shoes/WMNS+AIR+JORDAN+1+LOW+SE.avif",
	},
];

export const columns = [
    {
        title: "Featured",
        links: ["Air Force 1", "Huarache", "Air Max 90", "Air Max 95"],
    },
    {
        title: "Shoes",
        links: ["All Shoes", "Custom Shoes", "Jordan Shoes", "Running Shoes"],
    },
    {
        title: "Clothing",
        links: ["All Clothing", "Modest Wear", "Hoodies & Pullovers", "Shirts & Tops"],
    },
    {
        title: "Kids'",
        links: ["Infant & Toddler Shoes", "Kids' Shoes", "Kids' Jordan Shoes", "Kids' Basketball Shoes"],
    },
] as const;

export const footerColumns = [
    {
        title: "Resources",
        links: ["Order Status", "Shipping and Delivery", "Returns", "Payment Options", "Contact Us"],
    },
    {
        title: "Help",
        links: ["FAQ", "Size Guide", "Product Care", "Accessibility"],
    },
    {
        title: "Company",
        links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
    },
    {
        title: "Social",
        links: ["Instagram", "Facebook", "Twitter", "YouTube"],
    },
] as const;

