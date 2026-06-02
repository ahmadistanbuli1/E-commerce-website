# Architecture & API Endpoints

## Backend Architecture (MVCS Like In NestJs)

The backend follows the MVCS pattern to ensure clean separation of concerns:

1.  **Models (`/models`):** Database schemas and ORM definitions.
2.  **Views (`/views` or Frontend client):** Handled by the React application.
3.  **Controllers (`/controllers`):** Handle HTTP requests, extract parameters, call services, and return HTTP responses.
4.  **Services (`/services`):** Contain all core business logic and direct database interactions.
5.  **Routes (`/routes`):** Define HTTP endpoints and map them to specific controllers. Includes middleware (auth, validation).

## Frontend Architecture

- `src/components`: Navbar ...
- `src/components/ui` : Reusable UI components (Buttons, Modals, etc.)
- `src/pages`: Home, ProductDetails, Cart, Orders, AdminDashboard, etc.
- `src/app` : For Global Providers (Redux, React Query, etc.)
- `src/app/features` : For Redux slices (e.g., authSlice, cartSlice)
- `src/config` : For Axios instance and API endpoint definitions.
- `src/utils` : For utility functions (e.g., formatPrice, calculateTotal, etc.)
- `src/hooks` : For custom React hooks (e.g., useAuth, useCart, etc.)
- `src/routes` : For React Router route definitions.
- `src/interfaces` : For TypeScript interfaces
- `src/types` : For TypeScript types

## RESTful API Endpoints

### Auth (`/api/auth`)

- `POST /register` : Register a new user.
- `POST /login` : Authenticate user and return JWT.
- `GET /me` : Get current logged-in user profile.

### Users (`/api/users`)

- `GET /` : Get all users (Admin only).
- `GET /:id` : Get user by ID.
- `PUT /:id` : Update user profile.

### Users (`/api/users`)

- `GET /` : Get all users (Admin only).
- `GET /:id` : Get user by ID (Admin & Account Owner).
- `PUT /:id` : Update user profile (Account Owner).
- `POST /` : Create a new user/admin/staff account (Admin only).
- `PUT /:id/role-status` : Change user role (e.g., CUSTOMER to ADMIN) or ban/suspend user (Admin only).
- `DELETE /:id` : Soft delete/Archive a user account (Admin only).

### Products (`/api/products`)

- `GET /` : Get all products (with pagination & filtering).
- `GET /:id` : Get single product details.
- `POST /` : Create new product (Admin only).
- `PUT /:id` : Update product (Admin only).
- `DELETE /:id` : Archive/Delete product (Admin only).

### Categories (`/api/categories`)

- `GET /` : Get all categories.
- `POST /` : Create category (Admin only).

### Cart (`/api/cart`)

- `GET /` : Get current user's cart and items.
- `POST /items` : Add item to cart.
- `PUT /items/:itemId` : Update item quantity.
- `DELETE /items/:itemId` : Remove item from cart.
- `DELETE /` : Clear cart.

### Orders (`/api/orders`)

- `POST /` : Checkout / Create a new order from cart.
- `GET /my-orders` : Get logged-in user's order history.
- `GET /` : Get all orders (Admin only).
- `PUT /:id/status` : Update order status (Admin only).

### Wishlist (`/api/wishlist`)

- `GET /` : Get all wishlist items for the logged-in user.
- `POST /:productId` : Add a product to the wishlist.
- `DELETE /:productId` : Remove a product from the wishlist.

### Admin Dashboard Analytics (`/api/admin/dashboard`)

- `GET /stats` : Get overall statistics (total revenue, total orders, users count, low stock products) for dashboard charts.
- `GET /recent-orders` : Fetch the latest 5-10 orders for quick overview.
