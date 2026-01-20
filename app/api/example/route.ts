import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection, getWalletsCollection } from '@/lib/db-helpers'
import { hashPassword, generateReferralCode, generateToken } from '@/lib/auth'
import { User, Wallet } from '@/lib/types'
import { ObjectId } from 'mongodb'

// Example: Register a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, country, countryCode, phone, referredBy } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const users = await getUsersCollection()

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password and generate referral code
    const hashedPassword = await hashPassword(password)
    const referralCode = generateReferralCode(username)

    // Create new user
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      country: country || 'Unknown',
      countryCode: countryCode || '+1',
      phone: phone || '',
      referralCode,
      referredBy: referredBy || undefined,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const userResult = await users.insertOne(newUser)
    const userId = userResult.insertedId.toString()

    // Create wallet for the user
    const wallets = await getWalletsCollection()
    const newWallet: Wallet = {
      userId,
      balance: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await wallets.insertOne(newWallet)

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      username,
      isAdmin: false
    })

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email,
        referralCode
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example: Get user by ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const users = await getUsersCollection()
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password from response
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's wallet
    const wallets = await getWalletsCollection()
    const wallet = await wallets.findOne({ userId })

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        country: user.country,
        countryCode: user.countryCode,
        phone: user.phone,
        referralCode: user.referralCode,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      wallet: wallet ? {
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        totalDeposits: wallet.totalDeposits,
        totalWithdrawals: wallet.totalWithdrawals
      } : null
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
