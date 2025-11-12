// export const MOCK_PRODUCTS = [
// 	{
// 		id: 1,
// 		name: "Air Jordan 1 Mid SE",
// 		description: "Men's Shoes",
// 		meta: "6 Colour",
// 		price: 149.99,
// 		imageSrc: "/shoes/AIR+JORDAN+1+MID+SE.avif",
// 		badge: { label: "Just In", tone: "orange" as const },
// 	},
// 	{
// 		id: 2,
// 		name: "Air Jordan 1 Low SE",
// 		description: "Men's Shoes",
// 		meta: "4 Colour",
// 		price: 129.99,
// 		imageSrc: "/shoes/AIR+JORDAN+1+LOW+SE.avif",
// 		badge: { label: "Best Seller", tone: "red" as const },
// 	},
// 	{
// 		id: 3,
// 		name: "Air Jordan 1 Retro High OG \"Pro Green\"",
// 		description: "Women's Shoes",
// 		meta: "6 Colour",
// 		price: 189.99,
// 		imageSrc: "/shoes/WMNS+AIR+JORDAN+1+RETRO+HI+OG.avif",
// 		badge: { label: "Trending", tone: "green" as const },
// 	},
// 	{
// 		id: 4,
// 		name: "Air Jordan 1 Low SE",
// 		description: "Women's Shoes",
// 		meta: "3 Colour",
// 		price: 139.99,
// 		imageSrc: "/shoes/WMNS+AIR+JORDAN+1+LOW+SE.avif",
// 	},
// ];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Nike Air Max Pulse",
        description: "Men's Shoes",
        gender: "men",
        sizes: ["10", "11", "12"],
        colors: ["white", "black"],
        price: 149.99,
        meta: "6 Colour",
        image: "/shoes/AIR+JORDAN+1+MID+SE.avif",
        createdAt: "2025-08-01T00:00:00.000Z",
        badge: { label: "Best Seller", tone: "orange" },
    },
    {
        id: "2",
        name: "Nike Air Zoom Pegasus",
        description: "Women's Shoes",
        gender: "women",
        sizes: ["6", "7", "8"],
        colors: ["red", "white"],
        price: 129.99,
        meta: "4 Colour",
        image: "/shoes/AIR+JORDAN+1+MID+SE.avif",
        createdAt: "2025-07-20T00:00:00.000Z",
        badge: { label: "Extra 20% off", tone: "green" },
    },
    {
        id: "3",
        name: "Nike InfinityRN 4",
        description: "Unisex Shoes",
        gender: "unisex",
        sizes: ["6", "7", "8", "9.5", "10"],
        colors: ["black", "green"],
        price: 159.99,
        meta: "6 Colour",
        image: "/shoes/shoe-3.webp",
        createdAt: "2025-07-28T00:00:00.000Z",
        badge: { label: "Sustainable Materials", tone: "green" },
    },
    {
        id: "4",
        name: "Nike Metcon 9",
        description: "Men's Training Shoes",
        gender: "men",
        sizes: ["11", "12", "13"],
        colors: ["grey", "black"],
        price: 139.99,
        meta: "3 Colour",
        image: "/shoes/WMNS+AIR+JORDAN+1+RETRO+HI+OG.avif",
        createdAt: "2025-06-10T00:00:00.000Z",
        badge: { label: "New", tone: "orange" },
    },
    {
        id: "5",
        name: "Nike Blazer Low '77 Jumbo",
        description: "Women's Shoes",
        gender: "women",
        sizes: ["8", "9", "10"],
        colors: ["white", "blue"],
        price: 98.3,
        meta: "1 Colour",
        image: "/shoes/WMNS+AIR+JORDAN+1+LOW+SE.avif",
        createdAt: "2025-08-10T00:00:00.000Z",
        badge: { label: "Best Seller", tone: "red" },
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

export const filterList = [
    {
        title: 'Gender',
        options: ['Men', 'Women', 'Unisex'],
        isExpanded: false,
    },
    {
        title: 'Color',
        options: ['Red', 'Green', 'Blue', 'Black', 'White'],
        isExpanded: false,
    },
    {
        title: 'Size',
        options: ['7', '8', '9', '10', '11', '12'],
        isExpanded: false,
    },
    {
        title: 'Price Range',
        options: ['$0 - $50', '$51 - $100', 'Over $200'],
        isExpanded: false,
    },
];

