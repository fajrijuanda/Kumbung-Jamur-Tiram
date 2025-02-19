// Next Imports
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic');

  let sensor = await prisma.sensor.findFirst({
    where: {
      topic: topic
    },
  });

  if (!sensor) {
    return NextResponse.json({ error: 'Sensor not found' }, { status: 404 });
  }

  // Ambil 12 data sensor terbaru
  let sensorData = await prisma.data.findMany({
    select: {
      value: true,
      createdAt: true,
    },
    where: {
      sensorId: sensor.id,
    },
    orderBy: {
      createdAt: 'desc', // Data terbaru di awal array
    },
    take: 12,
  });

  if (sensorData.length === 0) {
    return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
  }

  // Parsing langsung dari createdAt data terbaru (elemen pertama)
  const latestRecord = sensorData[0];
  const latestRecordDate = new Date(latestRecord.createdAt);

  // Format tanggal dan waktu
  const latestTime = latestRecordDate.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit', hour12: false}).replace(/\./g, ':');
  const latestDate = latestRecordDate.toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-');

  // Format masing-masing data sensor (waktu dalam format HH:mm:ss)
  const formattedData = sensorData.map(item => ({
    value: item.value,
    createdAt: new Date(item.createdAt)
      .toLocaleTimeString('id-ID', {minute: '2-digit', second: '2-digit', hour12: false}).replace(/\./g, ':')
  }));

  const data = {
    sensor: {
      unit: sensor.unit,
      name: sensor.name
    },
    dataList: formattedData.reverse(), // Urutkan dari data terlama ke terbaru
    latest: {
      time: latestTime,
      date: latestDate,
      value: latestRecord.value
    }
  };

  return NextResponse.json(data);
}
