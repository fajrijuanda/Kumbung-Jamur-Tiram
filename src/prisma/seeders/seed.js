const {
  PrismaClient
} = require('@prisma/client');
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

  const sensors = [{
      name: 'Suhu Udara',
      topic: "sensor/suhu_udara",
      unit: "°C"
    },
    {
      name: 'Kelembaban Udara',
      topic: "sensor/kelembaban_udara",
      unit: "%"
    },
    {
      name: 'UV',
      topic: "sensor/UV",
      unit: "index"
    },
    {
      name: 'O2',
      topic: "sensor/O2",
      unit: "%"
    },
    {
      name: 'CO2',
      topic: "sensor/CO2",
      unit: "ppm"
    },
    {
      name: 'pH',
      topic: "sensor/pH",
      unit: "pH"
    },
    {
      name: 'Suhu Media',
      topic: "sensor/suhu_media",
      unit: "°C"
    },
    {
      name: 'Kelembaban Media',
      topic: "sensor/kelembaban_media",
      unit: "%"
    }
  ];

  for (let i = 0; i < sensors.length; i++) {
    let sensor = sensors[i]

    await prisma.sensor.create({
      data: {
        name: sensor.name,
        topic: sensor.topic,
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
