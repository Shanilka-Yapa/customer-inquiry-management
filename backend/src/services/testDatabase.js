const prisma = require("./prisma");

async function testDatabase() {
  try {
    await prisma.$connect();

    console.log("PostgreSQL connected successfully");

    const users = await prisma.user.count();
    const inquiries = await prisma.inquiry.count();

    console.log("Users:", users);
    console.log("Inquiries:", inquiries);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
