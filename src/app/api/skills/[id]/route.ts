import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Skill from '@/models/Skill'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    await connectDB()
    const skill = await Skill.findById(params.id)
    
    if (!skill) {
      return new NextResponse(
        JSON.stringify({ error: 'Skill not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error in skill GET:', error)
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
    const skill = await Skill.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    )

    if (!skill) {
      return new NextResponse(
        JSON.stringify({ error: 'Skill not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error in skill PUT:', error)
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
    const skill = await Skill.findByIdAndDelete(params.id)

    if (!skill) {
      return new NextResponse(
        JSON.stringify({ error: 'Skill not found' }),
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Error in skill DELETE:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 