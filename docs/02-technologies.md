# Tech Stack

## Frontend

- **Framework:** React with TypeScript (Vite).
- **Styling:** Tailwind CSS Only.
- **Routing:** React Router v6.
- **Server State Management:** React Query (TanStack Query) for data fetching, caching, and synchronization.
- **Client State Management:** Redux Toolkit (for global UI states like theme, sidebar toggles, local cart drafts).
- **Form Handling:** React Hook Form + Yup (for validation).
- **HTTP Client:** Axios for making API requests to the backend.
- **Icons:** Use Lucide Icons for a consistent and modern iconography across the application.

## Backend

- **Runtime:** Node.js.
- **Framework:** Express.js.
- **Language:** TypeScript.
- **Architecture:** MVCS (Model - View - Controller - Service).
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs for password hashing.
- **Warning:** Use Cookie For Storing JWT for better security against XSS attacks Instead of Local Storage.

## Database

- **Engine:** PostgreSQL.
- **Prisma** as the ORM for database interactions, schema migrations, and type safety.
- Database relations are defined using Prisma schema and can be extended if needed 

## Name Database & Password For .env File
- **Database Name:** `ecommerce_db`
- **Password:** : `0000`
