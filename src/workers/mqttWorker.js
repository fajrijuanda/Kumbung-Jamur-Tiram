// Load environment variables from .env file
require('dotenv').config();  // <-- This line is needed to load .env file

const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// MQTT Client setup
const mqttUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(mqttUrl);

// List of sensor topics
const topics = [
    "sensor/suhu_udara",
    "sensor/kelembaban_udara",
    "sensor/UV",
    "sensor/O2",
    "sensor/CO2",
    "sensor/pH",
    "sensor/suhu_media",
    "sensor/kelembaban_media"
];

// Subscription to sensor topics
client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error subscribing to topics:', err);
        } else {
            console.log('Subscribed to topics:', topics);
        }
    });
});

// Listen to messages on the topics
client.on('message', async (topic, message) => {
    if (topics.includes(topic)) {
        try {
            const value = parseFloat(message.toString());

            // Check if the kumbung exists in the database
            let kumbung = await prisma.kumbung.findFirst({
                where: {
                    name: 'Kumbung Jamur Tiram',
                },
            });

            if (!kumbung) {
                throw "Kumbung Not Found";
            }

            // Check if the sensor exists in the database
            let sensor = await prisma.sensor.findFirst({
                where: {
                    topic: topic,
                },
            });

            // If sensor does not exist, create it
            if (!sensor) {
                throw "Sensor Not Found";
            }

            // Save data to PostgreSQL using Prisma
            const savedData = await prisma.data.create({
                data: {
                    value: value,
                    sensorId: sensor.id, // Assuming sensorId is included in the message
                },
            });
        } catch (err) {
            console.error('Error processing message:', err);
        }
    }
});

// Graceful shutdown on process exit
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    client.end();
    process.exit();
});
