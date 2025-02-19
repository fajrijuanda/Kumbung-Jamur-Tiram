const mqtt = require('mqtt');

// Konfigurasi MQTT
const brokerUrl = 'mqtt://localhost'; // Bisa diganti broker lain
const client = mqtt.connect(brokerUrl);

// Daftar topik sensor
const sensors = [
    { topic: "sensor/suhu_udara", min: 35.0, max: 40.0 },
    { topic: "sensor/kelembaban_udara", min: 40, max: 80 },
    { topic: "sensor/UV", min: 0, max: 11 },
    { topic: "sensor/O2", min: 19, max: 22 },
    { topic: "sensor/CO2", min: 0, max: 10000 },
    { topic: "sensor/pH", min: 5.5, max: 7.5 },
    { topic: "sensor/suhu_media", min: 40, max: 60 },
    { topic: "sensor/kelembaban_media", min: 30, max: 70 }
];

// Fungsi untuk membuat nilai acak
function generateRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// Koneksi ke broker MQTT
client.on('connect', () => {
    console.log('Terhubung ke broker MQTT');

    // Kirim data sensor setiap 500 ms (hanya nilai saja)
    setInterval(() => {
        sensors.forEach(sensor => {
            const value = generateRandomValue(sensor.min, sensor.max);
            client.publish(sensor.topic, value, { qos: 0 }, () => {
                console.log(`Data terkirim: ${sensor.topic} -> ${value}`);
            });
        });
    }, 500);
});

// Tangani error MQTT
client.on('error', (err) => {
    console.error('MQTT Error:', err);
});
