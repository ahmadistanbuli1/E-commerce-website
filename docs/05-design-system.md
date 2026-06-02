# Design System

## Typography

- **Primary Font:** Inter (or similar modern sans-serif).
- **Headings:** Bold, dark slate.
- **Body:** Regular, readable gray.

## Color Palette (Tailwind Configuration)

- **Primary:** Blue (e.g., `blue-600` for buttons, `blue-700` for hover).
- **Secondary:** Slate/Gray (e.g., `slate-100` for backgrounds, `slate-800` for primary text).
- **Success:** Green (`green-500`) for success messages and completed states.
- **Danger:** Red (`red-500`) for errors and delete actions.
- **Warning:** Yellow (`yellow-500`) for pending statuses.

## UI Components

- **Buttons:**
  - Solid (Primary actions like 'Add to Cart').
  - Outline (Secondary actions like 'Cancel').
- **Inputs:** Clean borders, focus rings (e.g., `focus:ring-blue-500`), error states with red borders.
- **Cards:** Used for product displays. Subtle shadow (`shadow-md`), rounded corners (`rounded-lg`), hover effect (`hover:-translate-y-1`).
- **Navigation:** Sticky Top Navbar with search bar, user profile dropdown, and cart icon with badge.

- **Admin Layout Components:**
  - **Sidebar:** Fixed left navigation for Admin modules (Dashboard, Users, Products, Orders).
  - **Data Tables:** Reusable table component with pagination, sorting, and action buttons (Edit/Delete).
  - **Charts:** Integration with a charting library (e.g., Recharts or Chart.js) for visual data representation in the dashboard.
- **Wishlist Components:**
  - **Heart Toggle Button:** An animated heart icon on product cards (red when active, outline when inactive).

## Layout

- **Container:** Max-width constrained (e.g., `max-w-7xl mx-auto`).
- **Grid:** Responsive grid for products (1 col on mobile, 2 on tablet, 3/4 on desktop).

## Warnings

- Use SOLID For Any Code You Write For Better Code Quality And Maintainability.
- Follow DRY Principles To Avoid Code Duplication.
- Product images use placeholder service during development and will be migrated to Cloudinary in production.
