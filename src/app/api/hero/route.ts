import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Hero from '@/models/Hero'

export async function GET() {
  try {
    await connectDB()
    const hero = await Hero.find().sort({ createdAt: -1 })
    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error in GET /api/hero:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Delete existing hero data to maintain only one record
    await Hero.deleteMany({})

    const data = await request.json()
    const hero = await Hero.create(data)

    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error in POST /api/hero:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 