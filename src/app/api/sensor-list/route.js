import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
        kumbung: { select: { name: true } },
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(sensors, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus sensor berdasarkan ID
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.sensor.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ message: "Sensor deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sensor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah sensor baru
export async function POST(req) {
  try {
    const { name, topic, unit, description, location, kumbungId } = await req.json();

    // Pastikan kumbungId ada di database
    const existingKumbung = await prisma.kumbung.findUnique({
      where: { id: Number(kumbungId) }
    });

    if (!existingKumbung) {
      return NextResponse.json({ error: "Kumbung tidak ditemukan" }, { status: 400 });
    }

    // Simpan sensor baru
    const newSensor = await prisma.sensor.create({
      data: { name, topic, unit, description, location, kumbungId: Number(kumbungId) }
    });

    return NextResponse.json(newSensor, { status: 201 });
  } catch (error) {
    console.error("Error adding sensor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
