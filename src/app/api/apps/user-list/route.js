import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET: Mengambil daftar semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

// POST: Membuat user baru
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email } = body

    // Validasi data bisa dilakukan di sini jika diperlukan
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
  }
}

// PUT: Mengupdate data user yang sudah ada
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, name, email } = body

    if (!id) {
      return NextResponse.json({ error: 'ID user diperlukan' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
      },
    })
    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate user' }, { status: 500 })
  }
}

// DELETE: Menghapus user
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID user diperlukan' }, { status: 400 })
    }

    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ user: deletedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 })
  }
}
