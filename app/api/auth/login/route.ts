import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-helpers'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const users = await getUsersCollection()

    // Find user by email
    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    })

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
