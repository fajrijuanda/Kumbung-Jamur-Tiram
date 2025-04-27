import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Ambil data dari request body
    const { email, password } = await req.json();

    console.log('📌 Incoming Login Request:', { email });

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan, kirim error 401
    if (!user) {
      console.log('⚠️ User not found:', email);
      
return NextResponse.json(
        { message: ['Email or Password is invalid'] },
        { status: 401, statusText: 'Unauthorized Access' }
      );
    }

    // Bandingkan password yang dimasukkan dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('⚠️ Invalid password for:', email);
      
return NextResponse.json(
        { message: ['Email or Password is invalid'] },
        { status: 401, statusText: 'Unauthorized Access' }
      );
    }

    // Hilangkan password sebelum mengirimkan respons ke client
    const { password: _, ...filteredUserData } = user;

    console.log('✅ Login successful for:', email);
    
return NextResponse.json(filteredUserData, { status: 200 });

  } catch (error) {
    console.error('❌ Server Error:', error);
    
return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
