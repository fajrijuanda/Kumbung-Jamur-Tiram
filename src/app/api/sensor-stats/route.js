import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const encoder = new TextEncoder();

  // Membuka Stream untuk mengirim data berkala
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          console.log("🔄 Fetching sensor data...");

          // Ambil data sensor terbaru
          let kumbung = await prisma.kumbung.findFirst({
            where: { name: "Kumbung Jamur Tiram" },
          });

          if (!kumbung) throw new Error("Kumbung Not Found");

          let sensors = await prisma.sensor.findMany({
            where: { kumbungId: kumbung.id },
            include: {
              data: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { createdAt: true },
              },
            },
          });

          if (!sensors) throw new Error("Sensor Not Found");

          // Hitung Sensor Aktif secara otomatis
          const now = new Date();
          const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
          let activeSensors = 0;

          sensors.forEach(sensor => {
            if (sensor.data?.length) {
              const lastDataTime = new Date(sensor.data[0].createdAt);
              if (lastDataTime > oneMinuteAgo) {
                activeSensors++;
              }
            }
          });

          const totalSensors = sensors.length;

          // Kirim data terbaru ke client (pastikan selalu dikirim, meskipun tidak ada perubahan)
          const data = JSON.stringify({ totalSensors, activeSensors });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          console.log(`📡 Data sent: ${data}`);

          // Tunggu 5 detik sebelum mengirim update berikutnya
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error("❌ Database Fetch Error:", error);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
