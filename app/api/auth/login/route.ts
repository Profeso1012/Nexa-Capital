import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-helpers'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    console.log('Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Getting users collection...')
    const users = await getUsersCollection()
    console.log('Users collection obtained')

    // Find user by email
    console.log('Finding user...')
    const user = await users.findOne({ email })
    console.log('User found:', !!user)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('Verifying password...')
    const isValidPassword = await comparePassword(password, user.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    console.log('Generating token...')
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    })
    console.log('Token generated successfully')

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id!.toString(),
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        referralCode: user.referralCode
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
