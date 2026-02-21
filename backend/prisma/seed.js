const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'John Smith', email: 'john.smith@example.com' } }),
    prisma.user.create({ data: { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' } }),
    prisma.user.create({ data: { name: 'Michael Brown', email: 'michael.brown@example.com' } }),
    prisma.user.create({ data: { name: 'Emily Davis', email: 'emily.davis@example.com' } }),
    prisma.user.create({ data: { name: 'David Wilson', email: 'david.wilson@example.com' } })
  ]);

  const products = await Promise.all([
    prisma.product.create({ data: { name: 'Laptop', price: 999.99, stock: 15 } }),
    prisma.product.create({ data: { name: 'Wireless Mouse', price: 29.99, stock: 50 } }),
    prisma.product.create({ data: { name: 'Mechanical Keyboard', price: 89.99, stock: 30 } }),
    prisma.product.create({ data: { name: 'USB-C Hub', price: 49.99, stock: 25 } }),
    prisma.product.create({ data: { name: 'Monitor 27"', price: 299.99, stock: 10 } }),
    prisma.product.create({ data: { name: 'Webcam HD', price: 79.99, stock: 20 } }),
    prisma.product.create({ data: { name: 'Headphones', price: 149.99, stock: 40 } }),
    prisma.product.create({ data: { name: 'Desk Lamp', price: 34.99, stock: 60 } }),
    prisma.product.create({ data: { name: 'Phone Stand', price: 19.99, stock: 100 } }),
    prisma.product.create({ data: { name: 'Cable Organizer', price: 12.99, stock: 75 } })
  ]);

  const orders = [];
  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomQuantity = Math.floor(Math.random() * 5) + 1;

    orders.push(
      prisma.order.create({
        data: {
          userId: randomUser.id,
          productId: randomProduct.id,
          quantity: randomQuantity
        }
      })
    );
  }
  await Promise.all(orders);

  console.log('Database seeded successfully!');
  console.log(`Created ${users.length} users, ${products.length} products, and ${orders.length} orders`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
