const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Optionally, clear existing sensor data before seeding
  // await prisma.sensor.deleteMany();

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
    { name: 'Suhu Udara', topic: "sensor/suhu_udara", unit: "°C", type: "temperature" },
    { name: 'Kelembaban Udara', topic: "sensor/kelembaban_udara", unit: "%", type: "humidity" },
    { name: 'Gas', topic: "sensor/gas", unit: "ppm", type: "gas" },
    { name: 'O2', topic: "sensor/O2", unit: "%", type: "o2" },
    { name: 'Kelembaban Tanah', topic: "sensor/soil_moisture", unit: "%", type: "soilMoisture" },
    { name: 'pH Tanah', topic: "sensor/soil_ph", unit: "pH", type: "soilPH" },
    { name: 'Suhu Tanah', topic: "sensor/soil_temperature", unit: "°C", type: "soilTemp" },
    { name: 'Kondusivitas Tanah', topic: "sensor/soil_conductivity", unit: "µS/cm", type: "soilConductivity" }
  ];

  for (let i = 0; i < sensors.length; i++) {
    let sensor = sensors[i];

    await prisma.sensor.create({
      data: {
        name: sensor.name,
        topic: sensor.topic,
        location: 'test',
        description: 'test',
        unit: sensor.unit,
        type: sensor.type, // Menambahkan type di sini
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
