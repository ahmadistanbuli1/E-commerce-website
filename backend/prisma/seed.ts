import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@shop.com";
  const adminPassword = "Admin@123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN"
    },
    create: {
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN"
    },
    select: { id: true }
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: "Electronics", description: "Phones, laptops, and gadgets" },
      { name: "Fashion", description: "Clothing and accessories" },
      { name: "Home", description: "Home essentials" }
    ],
    skipDuplicates: true
  });

  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  const byName = new Map(allCategories.map((c) => [c.name, c.id]));

  const picsum = (seed: number) => `https://picsum.photos/seed/${seed}/600/400`;

  await prisma.product.createMany({
    data: [
      {
        categoryId: byName.get("Electronics")!,
        name: "Wireless Headphones",
        description: "Noise-cancelling wireless headphones",
        price: "149.99",
        stock: 25,
        imageUrl: picsum(101),
        isActive: true
      },
      {
        categoryId: byName.get("Electronics")!,
        name: "Smart Watch",
        description: "Fitness tracking smart watch",
        price: "89.99",
        stock: 40,
        imageUrl: picsum(102),
        isActive: true
      },
      {
        categoryId: byName.get("Fashion")!,
        name: "Classic T-Shirt",
        description: "100% cotton t-shirt",
        price: "19.99",
        stock: 120,
        imageUrl: picsum(103),
        isActive: true
      },
      {
        categoryId: byName.get("Home")!,
        name: "Coffee Maker",
        description: "Automatic coffee maker",
        price: "59.99",
        stock: 15,
        imageUrl: picsum(104),
        isActive: true
      }
    ],
    skipDuplicates: true
  });

  // Update existing seeded products if they were created earlier with via.placeholder.com
  await prisma.product.updateMany({
    where: { imageUrl: { contains: "via.placeholder.com" } },
    data: { imageUrl: picsum(999) }
  });

  // eslint-disable-next-line no-console
  console.log("[seed] done", { adminUserId: admin.id, categoriesCreated: categories.count });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("[seed] error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

