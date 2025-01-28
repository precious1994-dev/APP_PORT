import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    await connectDB()
    const count = await Project.countDocuments()
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error in projects count:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 