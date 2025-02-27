import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ GET: Ambil daftar kumbung untuk Select2
export async function GET() {
  try {
    const kumbungs = await prisma.kumbung.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return NextResponse.json(kumbungs, { status: 200 });
  } catch (error) {
    console.error("Error fetching kumbung:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
