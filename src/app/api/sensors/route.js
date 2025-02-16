/**
 * ! We haven't used this file in our template. We've used the server actions in the
 * ! `src/app/server/actions.ts` file to fetch the static data from the fake-db.
 * ! This file has been created to help you understand how you can create your own API routes.
 * ! Only consider making API routes if you're planing to share your project data with other applications.
 * ! else you can use the server actions or third-party APIs to fetch the data from your database.
 */
// Next Imports
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  let sensor = await prisma.sensor.findFirst({
    where: {
      name: name
    },
  });

  if (!sensor) {
    return NextResponse.json({ error: 'Sensor not found' }, { status: 404 });
  }

  // Sensor Data
  let sensorData = await prisma.data.findMany({
    select: {
      value: true,
      createdAt: true,
    },
    where: {
      sensorId: sensor.id,
    },
    orderBy: {
      createdAt: 'desc', // Sort by creation date descending
    },
    take: 12, // Limit to the last 12 records
  });

  const data = {
    dataList: sensorData.reverse()
  };
  return NextResponse.json(data)
}
