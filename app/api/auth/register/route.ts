import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection, getWalletsCollection, getReferralsCollection } from '@/lib/db-helpers'
import { hashPassword, generateReferralCode, generateToken } from '@/lib/auth'
import { User, Wallet, Referral, ReferralStatus } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, country, countryCode, phone, referredBy } = body

    // Validate input
    if (!username || !email || !password || !country || !phone) {
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

    // Verify referral code if provided
    let referrerId: string | undefined
    if (referredBy) {
      const referrer = await users.findOne({ referralCode: referredBy })
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        )
      }
      referrerId = referrer._id!.toString()
    }

    // Hash password and generate referral code
    const hashedPassword = await hashPassword(password)
    const referralCode = generateReferralCode(username)

    // Create new user
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      country,
      countryCode: countryCode || '+1',
      phone,
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

    // Create referral record if referred
    if (referrerId) {
      const referrals = await getReferralsCollection()
      const newReferral: Referral = {
        referrerId,
        referredUserId: userId,
        bonusEarned: 0,
        status: ReferralStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await referrals.insertOne(newReferral)
    }

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
