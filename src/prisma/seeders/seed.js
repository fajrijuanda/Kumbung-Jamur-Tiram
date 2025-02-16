const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Optionally, clear existing sensor data before seeding
  //await prisma.sensor.deleteMany();

  const hashedPassword = await bcrypt.hash('testmail123', 10);

  let user = await prisma.user.create({
    data: {
        name: 'testmail32',
        email: 'testmail32@gmail.com',
        password: hashedPassword
    },
  });

  let kumbung = await prisma.kumbung.create({
    data: {
        name: 'Kumbung Jamur Tiram',
        userId: user.id
    },
  });

  let sensor = await prisma.sensor.create({
    data: {
        name: 'sensor/suhu_udara',
        location: 'test',
        description: 'test',
        kumbungId: kumbung.id, // Assuming this ID is provided in the message
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
