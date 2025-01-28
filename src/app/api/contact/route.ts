import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function GET() {
  try {
    await connectDB()
    const contact = await Contact.find().sort({ createdAt: -1 })
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error in GET /api/contact:', error)
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

    // Delete existing contact data to maintain only one record
    await Contact.deleteMany({})

    const data = await request.json()
    const contact = await Contact.create(data)

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error in POST /api/contact:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 