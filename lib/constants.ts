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
        options: ['$0 - $50', '$51 - $100', 'Over $100'],
        isExpanded: false,
    },
];

