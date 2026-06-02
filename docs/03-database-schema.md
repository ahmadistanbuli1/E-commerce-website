# Database Schema & Relationships

## Tables

### Users

- `id` (PK, UUID)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `phone` (String, Optional)
- `role` (Enum: 'ADMIN', 'CUSTOMER')
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Categories

- `id` (PK, UUID)
- `name` (String, Unique)
- `description` (Text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Products

- `id` (PK, UUID)
- `categoryId` (FK -> Categories.id)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `stock` (Integer)
- `imageUrl` (String)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Cart

- `id` (PK, UUID)
- `userId` (FK -> Users.id, Unique)
- `updatedAt` (DateTime)

### CartItems

- `id` (PK, UUID)
- `cartId` (FK -> Cart.id)
- `productId` (FK -> Products.id)
- `quantity` (Integer)

### Wishlists

- `id` (PK, UUID)
- `userId` (FK -> Users.id)
- `productId` (FK -> Products.id)
- `createdAt` (DateTime)
  _(Note: A user can have many wishlist items, enforced by a unique compound index on userId + productId to prevent duplicates)._

### Orders

- `id` (PK, UUID)
- `userId` (FK -> Users.id)
- `totalPrice` (Decimal)
- `status` (Enum: 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
- `paymentMethod` (String)
- `shippingAddress` (Text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### OrderItems

- `id` (PK, UUID)
- `orderId` (FK -> Orders.id)
- `productId` (FK -> Products.id)
- `price` (Decimal/Float) - _Price at the time of purchase_
- `quantity` (Integer)

## Relationships

- User (1) --- (M) Orders
- User (1) --- (1) Cart
- Category (1) --- (M) Products
- Cart (1) --- (M) CartItems
- Order (1) --- (M) OrderItems
- Product (1) --- (M) CartItems/OrderItems
- User (1) --- (M) Wishlists
- Product (1) --- (M) Wishlists
