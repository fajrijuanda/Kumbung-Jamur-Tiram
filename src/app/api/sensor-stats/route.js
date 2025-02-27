import {
  PrismaClient
} from "@prisma/client";
import {
  NextResponse
} from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
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
    let sensors = await prisma.sensor.findMany({
      where: {
        kumbungId: kumbung.id,
      },
      include: {
        data: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
    });

    // If sensor does not exist, create it
    if (!sensors) {
      throw "Sensor Not Found";
    }

    // Get the current time and calculate one minute ago
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // Filter sensors that have a latest data record within the last minute
    const activeSensorsList = sensors.filter(sensor => {
      // Check if there is at least one data record
      if (sensor.data && sensor.data.length > 0) {
        const lastDataTime = new Date(sensor.data[0].createdAt);
        return lastDataTime > oneMinuteAgo;
      }
      return false;
    });

    // Final data
    const totalSensors = sensors.length;
    const activeSensors = activeSensorsList.length;

    // Return
    return NextResponse.json({
      totalSensors: totalSensors || 0,
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
