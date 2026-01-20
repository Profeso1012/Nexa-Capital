import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI
    const hasJwtSecret = !!process.env.JWT_SECRET
    
    // Try to connect to MongoDB
    let dbConnected = false
    let dbError = null
    
    try {
      const db = await getDb()
      await db.command({ ping: 1 })
      dbConnected = true
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json({
      status: 'ok',
      environment: {
        hasMongoUri,
        hasJwtSecret,
        nodeEnv: process.env.NODE_ENV
      },
      database: {
        connected: dbConnected,
        error: dbError
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
