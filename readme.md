KeyifliKutu - Experience Marketplace
A modern, elegant React web application for discovering and purchasing unique experiences like skydiving, spa treatments, luxury dining, workshops, and more.

Features
🎯 Dynamic content loading from Supabase
🔐 Authentication with email/password and Google Sign-In
🛒 Shopping cart with server-side persistence
❤️ Favorites system
🔍 Advanced filtering and search
📱 Fully responsive design
🎨 Modern UI with shadcn-ui components
🎥 Video hero section
Tech Stack
Framework: React 18 with Vite
UI Library: shadcn-ui + Tailwind CSS
Backend: Supabase (PostgreSQL)
Authentication: Supabase Auth
State Management: React Context API
Routing: React Router v6
Getting Started
Prerequisites
Node.js 18+ and pnpm
A Supabase account and project
Installation
Clone the repository

Install dependencies:

pnpm install
Configure environment variables:

Copy .env.example to .env
Add your Supabase credentials:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Supabase Setup
1. Database Tables
The following tables are automatically created:

app_a077ac80a8_activity - Top-level activity themes
app_a077ac80a8_category - Categories under themes
app_a077ac80a8_activity_type - Specific activity types
app_a077ac80a8_product - Experience products
app_a077ac80a8_cart - User shopping carts
app_a077ac80a8_favorites - User favorites
2. Enable Google OAuth (Optional)
Go to your Supabase project dashboard
Navigate to Authentication → Providers
Enable Google provider
Add your Google OAuth credentials
Set the redirect URL to: http://localhost:5173 (for development)
3. Seed Sample Data
You can add sample data through the Supabase dashboard or use the SQL editor:

-- Example: Add an activity
INSERT INTO app_a077ac80a8_activity (activity_name) 
VALUES ('Adventure Sports');

-- Example: Add a category
INSERT INTO app_a077ac80a8_category (activity_id, category_name) 
VALUES ('activity-uuid-here', 'Skydiving');

-- Example: Add a product
INSERT INTO app_a077ac80a8_product (
  activity_type_id, category_id, title, sub_title, 
  description, price, image_url, city, rating
) VALUES (
  'type-uuid-here', 'category-uuid-here',
  'Tandem Skydiving Experience', 
  'Jump from 15,000 feet',
  'Experience the thrill of freefall with our professional instructors.',
  299.99,
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
  'Los Angeles',
  4.9
);
Running the Application
Development mode:

pnpm run dev
Build for production:

pnpm run build
Preview production build:

pnpm run preview
Project Structure
src/
├── components/
│   ├── ui/              # shadcn-ui components
│   └── Navbar.tsx       # Main navigation
├── contexts/
│   ├── AuthContext.tsx      # Authentication state
│   ├── CartContext.tsx      # Shopping cart state
│   └── FavoritesContext.tsx # Favorites state
├── lib/
│   └── supabase.ts      # Supabase client & types
├── pages/
│   ├── Home.tsx         # Homepage with video hero
│   ├── Products.tsx     # Product listing with filters
│   ├── ProductDetail.tsx # Single product view
│   └── NotFound.tsx     # 404 page
└── App.tsx              # Main app component
Key Features Explained
Authentication
Email/password registration and login
Google OAuth integration
Session persistence
Protected routes for cart and favorites
Shopping Cart
Add/remove items
Update quantities
Server-side persistence (syncs across devices)
Anonymous cart storage in localStorage (syncs on login)
Favorites
Save favorite experiences
Quick access to saved items
Server-side persistence
Product Filtering
Filter by activity theme, category, type
Price range slider
City/location filter
Sort by price, rating, or date
Real-time search
Promotional Video
Autoplay, muted, looped video on homepage
Fallback poster image for better performance
Mobile-optimized
Database Schema
Tables and Relationships
ACTIVITY (themes)
  └── CATEGORY (categories)
      └── ACTIVITY_TYPE (specific types)
          └── PRODUCT (experiences)

USER (Supabase Auth)
  ├── CART (shopping cart items)
  └── FAVORITES (saved experiences)
Environment Variables
Variable	Description
VITE_SUPABASE_URL	Your Supabase project URL
VITE_SUPABASE_ANON_KEY	Your Supabase anonymous key
Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a pull request
License
MIT License - feel free to use this project for your own purposes.

Support
For issues or questions, please open an issue on GitHub.