// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmail.com.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {},
    create: {
      email: "customer@gmail.com",
      name: "MD. Customer",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seed data added successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
