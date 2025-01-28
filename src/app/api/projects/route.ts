import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ order: 1 })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error in projects GET:', error)
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
    const project = await Project.create(data)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error in projects POST:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 