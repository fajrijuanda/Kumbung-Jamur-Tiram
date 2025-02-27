import {
  PrismaClient
} from "@prisma/client";
import {
  NextResponse
} from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let totalSensorsTable = await prisma.sensor.count();
    let activeSensors = 0;

    // Ambil data sensor sesuai seleksi field yang diinginkan
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
    let sensor = await prisma.sensor.findMany({
      where: {
        kumbungId: kumbung.id
      },
    });

    // If sensor does not exist, create it
    if (!sensor) {
      throw "Sensor Not Found";
    }

    // Kembalikan respon JSON dengan data yang diinginkan
    return NextResponse.json({
      totalSensorsTable: totalSensorsTable || 0,
      activeSensors: activeSensors || 0
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}
