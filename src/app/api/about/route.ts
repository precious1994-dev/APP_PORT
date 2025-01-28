import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import About from '@/models/About'

export async function GET() {
  try {
    await connectDB()
    const about = await About.find().sort({ createdAt: -1 })
    return NextResponse.json(about)
  } catch (error) {
    console.error('Error in GET /api/about:', error)
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

    // Delete existing about data to maintain only one record
    await About.deleteMany({})

    const data = await request.json()
    const about = await About.create(data)

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error in POST /api/about:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 