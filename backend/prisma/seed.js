require("dotenv").config();

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "staff@coffeeninja.com";
  const password = "Staff@12345";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Coffee Ninja Staff",
      email,
      passwordHash,
      role: "STAFF",
    },
  });

  console.log("Staff account ready:");
  console.log(`Email: ${user.email}`);
  console.log("Password: Staff@12345");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });