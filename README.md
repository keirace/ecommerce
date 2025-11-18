# Nike Ecommerce Clone

![Nike](https://img.shields.io/badge/React-19.2.0-blue)
![Next JS](https://img.shields.io/badge/Next-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-^5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-^4)
![PostGreSQL](https://img.shields.io/badge/PostGreSQL-8.16.3-red)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)
![Better Auth](https://img.shields.io/badge/Better-Auth-purple)

A full-stack Nike-inspired ecommerce platform built with modern web technologies, featuring product browsing, user authentication, shopping cart, and more.

## Core Features

### Authentication & User Management
- **Email/Password Authentication** - Secure sign up and sign in with Better Auth
- **Email Verification** - Account verification via email
- **Guest Sessions** - Anonymous browsing and shopping without account creation
- **Account Merging** - Seamlessly merge guest cart with user account on login
- **User Profiles** - Manage personal information and preferences

### Product Catalog
- **Product Browsing** - Browse shoes by category, gender, and collections
- **Advanced Filtering** - Filter by size, color, price range, brand, and more
- **Product Search** - Real-time search with auto-suggestions
- **Product Variants** - Multiple colors, sizes, and SKUs per product
- **Product Images** - High-quality image galleries with primary/secondary images
- **Product Reviews** - User-generated reviews and ratings
- **Recommended Products** - "You Might Also Like" suggestions

### Shopping Experience
- **Shopping Cart** - Add, remove, and modify cart items
- **Cart Popup** - Instant feedback when adding items to cart
- **Guest Cart Persistence** - Cart saved via httpOnly cookies for guests
- **Wishlist** - Save favorite products for later
- **Price Management** - Regular and sale pricing with variant-specific pricing

### Responsive Design
- **Mobile-First** - Optimized for mobile, tablet, and desktop
- **Filter Panel** - Slide-over filters on mobile, collapsible sidebar on desktop
- **Smooth Animations** - CSS transitions and transforms for better UX
- **Accessibility** - ARIA labels, semantic HTML, and keyboard navigation

### Admin Features (Seeding)
- **Database Seeding** - Populate database with realistic product data
- **Product Management** - Products, variants, categories, brands, and collections
- **Image Management** - Automatic image association and organization

## Technical Architecture

### Frontend
- **Next.js 15** with App Router for SSR and client-side routing
- **React 19** for component architecture
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom design system
- **Client/Server Components** - Optimal data fetching and rendering

### Backend
- **PostgreSQL** database with Neon hosting
- **Drizzle ORM** for type-safe database operations
- **Better Auth** for authentication and session management
- **Zod** for runtime validation and type inference
- **Server Actions** for form handling and mutations

### Database Schema
```
├── Users & Authentication
│   ├── users (profiles, preferences)
│   ├── accounts (OAuth providers)
│   ├── sessions (user sessions)
│   └── guests (anonymous sessions)
│
├── Products & Catalog
│   ├── products (name, description, metadata)
│   ├── product_variants (size, color, price, SKU)
│   ├── categories (sneakers, boots, sandals)
│   ├── brands (Nike, Jordan, etc.)
│   ├── colors (hex codes, names)
│   └── images (product gallery)
│
├── Shopping & Commerce
│   ├── carts (user/guest shopping carts)
│   ├── cart_items (products in cart)
│   ├── wishlists (saved products)
│   └── addresses (shipping/billing)
│
└── Content & Collections
    ├── collections (seasonal, featured)
    ├── product_collections (many-to-many)
    └── reviews (user feedback)
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate migrations
   npx drizzle-kit generate --name init
   
   # Apply migrations
   npx drizzle-kit migrate:push
   
   # Enable UUID extension in PostgreSQL
   # Connect to your DB and run: CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

5. **Seed Database**
   ```bash
   npx ts-node ./database/seed.ts
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (root)/              # Main application pages
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
│
├── components/              # Reusable UI components
│   ├── auth-form.tsx
│   ├── card.tsx
│   ├── filters.tsx
│   ├── navbar.tsx
│   └── ...
│
├── database/                # Database schema and models
│   ├── filters/             # Filter-related models
│   ├── account.model.ts
│   ├── user.model.ts
│   └── seed.ts
│
├── lib/                     # Utilities and configurations
│   ├── actions/             # Server actions
│   ├── auth.ts              # Authentication config
│   ├── db.ts                # Database connection
│   └── constants.ts
│
└── drizzle/                 # Database migrations
```

## Key Functionalities

### User Authentication Flow
1. **Email Lookup** - Check if email exists in system
2. **Sign Up/In** - Create account or authenticate existing user
3. **Session Management** - Secure session handling with Better Auth
4. **Guest Sessions** - Anonymous users get temporary sessions

### Product Filtering System
- **Server-Side Filtering** - Database queries with dynamic WHERE clauses
- **URL State Management** - Filters persist in search parameters
- **Real-Time Updates** - Filter changes update product list immediately
- **Aggregated Pricing** - Min/max prices calculated from variants

### Cart Management
```typescript
// Guest session creation
POST /api/guest-session
→ Creates guest record + httpOnly cookie

// Add to cart
POST /api/cart/add
→ Reads guest/user session
→ Creates cart if needed
→ Upserts cart items

// Cart merge on login
→ Merge guest cart into user cart
→ Clear guest session
```

### Mobile-Responsive Design
- **Breakpoint Strategy**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Filter Panel**: Slide-over on mobile, sidebar on desktop
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Images**: Responsive sizing with Next.js Image optimization

## Development Commands

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm run start               # Start production server

# Database
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate:push # Apply migrations
npx drizzle-kit studio      # Open Drizzle Studio

# Utilities
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking
```

## License

MIT License - feel free to use this project as a learning resource or starting point for your own ecommerce application.