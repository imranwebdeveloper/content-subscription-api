// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  const customer = await prisma.user.upsert({
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

  const ticket1 = await prisma.ticket.create({
    data: {
      subject: "Issue with login",
      description: "I can't log into my account.",
      status: "OPEN",
      customerId: customer.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      subject: "Bug in checkout process",
      description: "Customers can't complete orders.",
      status: "CLOSED",
      customerId: customer.id,
      executiveId: admin.id,
    },
  });

  // Create Replies
  await prisma.reply.create({
    data: {
      content: "We are looking into this issue.",
      ticketId: ticket1.id,
      userId: admin.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
