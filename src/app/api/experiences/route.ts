import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Experience from '@/models/Experience'

export async function GET() {
  try {
    await connectDB()
    const experiences = await Experience.find().sort({ order: 1 })
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error in experiences GET:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    await connectDB()
    const data = await request.json()
    const experience = await Experience.create(data)
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error in experiences POST:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 