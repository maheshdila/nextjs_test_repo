const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma_client = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  // Create admin user
  const admin = await prisma_client.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin);

  // Create customer users
  const customer1 = await prisma_client.user.create({
    data: {
      name: 'Customer One',
      email: 'customer1@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma_client.user.create({
    data: {
      name: 'Customer Two',
      email: 'customer2@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Created customer users:', customer1, customer2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma_client.$disconnect();
  }); 