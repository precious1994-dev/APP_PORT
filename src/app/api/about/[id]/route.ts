import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import About from '@/models/About'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const about = await About.findById(params.id)

    if (!about) {
      return NextResponse.json(
        { error: 'About not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error in GET /api/about/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const data = await request.json()
    const about = await About.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    })

    if (!about) {
      return NextResponse.json(
        { error: 'About not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error in PUT /api/about/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const about = await About.findByIdAndDelete(params.id)

    if (!about) {
      return NextResponse.json(
        { error: 'About not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'About deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/about/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 