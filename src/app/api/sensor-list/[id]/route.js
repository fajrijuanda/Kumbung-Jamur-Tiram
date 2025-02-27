import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, topic, unit, description, kumbungId } = await req.json();

    console.log("🔹 Data yang diterima:", { id, name, topic, unit, description, kumbungId });

    const updatedSensor = await prisma.sensor.update({
      where: { id: Number(id) },
      data: { name, topic, unit, description, kumbungId: Number(kumbungId) }
    });

    return NextResponse.json(updatedSensor, { status: 200 });
  } catch (error) {
    console.error("❌ Error Backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
