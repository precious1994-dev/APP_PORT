import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Skill from '@/models/Skill'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ order: 1 })
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error in skills GET:', error)
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
    const skill = await Skill.create(data)
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error in skills POST:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 