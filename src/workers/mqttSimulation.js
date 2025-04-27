const mqtt = require('mqtt');

// Konfigurasi MQTT
const brokerUrl = 'mqtt://localhost'; // Ganti dengan URL broker MQTT yang sesuai
const client = mqtt.connect(brokerUrl);

// Daftar topik yang akan di-subscribe
const sensorTopics = [
  "sensor/suhu_udara",
  "sensor/kelembaban_udara",
  "sensor/UV",
  "sensor/O2",
  "sensor/CO2",
  "sensor/pH",
  "sensor/suhu_media",
  "sensor/kelembaban_media"
];

// Menyimpan status topik yang sudah terhubung
let subscribedTopics = {};

// Koneksi ke broker MQTT
client.on('connect', () => {
  console.log('✅ Terhubung ke broker MQTT, menunggu data dari perangkat IoT...');

  // Subscribe ke semua topik sensor
  sensorTopics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`❌ Gagal subscribe ke ${topic}:`, err);
      } else {
        // Jika subscribe berhasil, set status topik sebagai false (belum menerima pesan)
        subscribedTopics[topic] = false;
      }
    });
  });
});

// Saat menerima pesan dari sensor (perangkat IoT)
client.on('message', (topic, message) => {
  const value = parseFloat(message.toString()); // Mengubah data pesan menjadi angka (float)

  // Jika pesan pertama kali diterima, tampilkan pesan "terhubung ke topik"
  if (!subscribedTopics[topic]) {
    console.log(`terhubung ke topik: ${topic}`);
    subscribedTopics[topic] = true; // Tandai bahwa pesan sudah diterima
  }

  console.log(`📥 Data diterima: ${topic} -> ${value}`);

  // Di sini, Anda bisa memproses nilai yang diterima atau menyimpannya ke database
});

// Tangani error MQTT
client.on('error', (err) => {
  console.error('❌ MQTT Error:', err);
});
