import mongoose from 'mongoose'

interface GlobalMongo {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: GlobalMongo | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI).then(() => mongoose)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default connectToDatabase 