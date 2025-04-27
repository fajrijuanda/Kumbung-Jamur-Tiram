const mqtt = require('mqtt');
const {
  PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

// Konfigurasi MQTT
const brokerUrl = 'mqtt://localhost';
const client = mqtt.connect(brokerUrl);

// Daftar topik yang akan di-subscribe
const sensorTopics = [
  "sensor/data" // Menggunakan topik yang dikirim dari perangkat IoT
];

// Menyimpan status topik yang sudah terhubung
let subscribedTopics = {};

// Koneksi ke broker MQTT
client.on('connect', () => {
  console.log('✅ Terhubung ke broker MQTT, menunggu data dari perangkat IoT...');

  // Subscribe ke topik sensor/data
  client.subscribe(sensorTopics, (err) => {
    if (err) {
      console.error(`❌ Gagal subscribe ke ${sensorTopics}:`, err);
    } else {
      // Jika subscribe berhasil, set status topik sebagai false (belum menerima pesan)
      subscribedTopics["sensor/data"] = false;
    }
  });
});

// Saat menerima pesan dari sensor (perangkat IoT)
client.on('message', async (topic, message) => {
  const payload = JSON.parse(message.toString()); // Mengubah pesan JSON menjadi objek

  // Jika pesan pertama kali diterima, tampilkan pesan "terhubung ke topik"
  if (!subscribedTopics[topic]) {
    console.log(`terhubung ke topik: ${topic}`);
    subscribedTopics[topic] = true; // Tandai bahwa pesan sudah diterima
  }

  // Menampilkan data yang diterima
  console.log(`📥 Data diterima: ${topic} ->`, payload);

  // Menyimpan data ke database untuk masing-masing sensor
  try {
    // Sensor data yang diterima
    const sensorData = {
      temperature: payload.temperature,
      humidity: payload.humidity,
      gas: payload.gas,
      o2: payload.o2,
      soilMoisture: payload.soilMoisture,
      soilPH: payload.soilPH,
      soilTemp: payload.soilTemp,
      soilConductivity: payload.soilConductivity
    };

    // Menyimpan data untuk setiap sensor
    for (const [sensorType, value] of Object.entries(sensorData)) {
      // Temukan sensor berdasarkan tipe data
      let sensor = await prisma.sensor.findFirst({
        where: {
          type: sensorType
        } // Mengambil jenis sensor berdasarkan nama sensor
      });

      // Jika sensor tidak ditemukan, buat sensor baru
      // if (!sensor) {
      //   sensor = await prisma.sensor.create({
      //     data: {
      //       type: sensorType
      //     }
      //   });
      //   console.log(`Sensor baru dibuat: ${sensor.type}`);
      // }

      // Simpan data yang diterima ke database
      await prisma.data.create({
        data: {
          sensorId: sensor.id, // Gunakan ID sensor
          value: value
        }
      });

      console.log(`✅ Data tersimpan di database: ${sensorType} -> ${value}`);
    }
  } catch (error) {
    console.error('❌ Error menyimpan data ke database:', error);
  }
});

// Tangani error MQTT
client.on('error', (err) => {
  console.error('❌ MQTT Error:', err);
});
