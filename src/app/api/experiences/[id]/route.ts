import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Experience from '@/models/Experience'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectDB()
    const experience = await Experience.findById(params.id)
    
    if (!experience) {
      return new NextResponse(
        JSON.stringify({ error: 'Experience not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error in experience GET:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
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
    const experience = await Experience.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    )

    if (!experience) {
      return new NextResponse(
        JSON.stringify({ error: 'Experience not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error in experience PUT:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    await connectDB()
    const experience = await Experience.findByIdAndDelete(params.id)

    if (!experience) {
      return new NextResponse(
        JSON.stringify({ error: 'Experience not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Error in experience DELETE:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 