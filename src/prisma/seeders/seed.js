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

  const sensors = [
    { topic: "sensor/suhu_udara", min: 35.0, max: 40.0, unit: "°C" },
    { topic: "sensor/kelembaban_udara", min: 40, max: 80, unit: "%" },
    { topic: "sensor/UV", min: 0, max: 11, unit: "index" },
    { topic: "sensor/O2", min: 19, max: 22, unit: "%" },
    { topic: "sensor/CO2", min: 300, max: 800, unit: "ppm" },
    { topic: "sensor/pH", min: 5.5, max: 7.5, unit: "pH" },
    { topic: "sensor/suhu_media", min: 18, max: 30, unit: "°C" },
    { topic: "sensor/kelembaban_media", min: 30, max: 70, unit: "%" }
  ];

  for (let i = 0; i < sensors.length; i++) {
    let sensor = sensors[i]
    
    await prisma.sensor.create({
      data: {
        name: sensor.topic,
        location: 'test',
        description: 'test',
        unit: sensor.unit,
        kumbungId: kumbung.id,
      },
    });
  }

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
