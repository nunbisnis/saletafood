// Test database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful!', result);
    return true;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
