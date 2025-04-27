import {
  PrismaClient
} from "@prisma/client";
import {
  NextResponse
} from "next/server";

const prisma = new PrismaClient();

// GET: Ambil daftar sensor
export async function GET() {
  try {
    const sensors = await prisma.sensor.findMany({
      select: {
        id: true,
        name: true,
        topic: true,
        unit: true,
        description: true,
        location: true,
        kumbungId: true,
        kumbung: {
          select: {
            name: true
          }
        }, // Ambil nama kumbung
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(sensors, {
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

// DELETE: Hapus sensor berdasarkan ID
export async function DELETE(req) {
  try {
    const {
      id
    } = await req.json();
    await prisma.sensor.delete({
      where: {
        id: Number(id)
      },
    });
    return NextResponse.json({
      message: "Sensor deleted successfully"
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error deleting sensor:", error);
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}

// POST: Tambah sensor baru
export async function POST(req) {
  try {
    const {
      name,
      topic,
      unit,
      description,
      location,
      kumbungId
    } = await req.json();

    // Pastikan kumbungId ada di database
    const existingKumbung = await prisma.kumbung.findUnique({
      where: {
        id: Number(kumbungId)
      }
    });

    if (!existingKumbung) {
      return NextResponse.json({
        error: "Kumbung tidak ditemukan"
      }, {
        status: 400
      });
    }

    // Simpan sensor baru
    const newSensor = await prisma.sensor.create({
      data: {
        name,
        topic,
        unit,
        description,
        location,
        kumbungId: Number(kumbungId)
      }
    });

    return NextResponse.json(newSensor, {
      status: 201
    });
  } catch (error) {
    console.error("Error adding sensor:", error);
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}

// GET: Ambil daftar kumbung untuk Select2
export async function GET_KUMBUNG() {
  try {
    const kumbungs = await prisma.kumbung.findMany({
      select: {
        id: true,
        name: true
      }
    });
    return NextResponse.json(kumbungs, {
      status: 200
    });
  } catch (error) {
    console.error("Error fetching kumbung:", error);
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}

export default async function handler(req, res) {
  const {
    id
  } = req.query;

  if (req.method === "PUT") {
    try {
      const {
        name,
        topic,
        unit,
        description,
        kumbungId
      } = req.body;

      console.log("🔹 Data yang diterima:", {
        id,
        name,
        topic,
        unit,
        description,
        kumbungId
      });

      const updatedSensor = await prisma.sensor.update({
        where: {
          id: Number(id)
        },
        data: {
          name,
          topic,
          unit,
          description,
          kumbungId: Number(kumbungId)
        }
      });

      return res.status(200).json(updatedSensor);
    } catch (error) {
      console.error("❌ Error Backend:", error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

  return res.status(405).json({
    error: "Method Not Allowed"
  });
}
