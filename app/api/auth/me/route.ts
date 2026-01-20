import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getUsersCollection, getWalletsCollection } from '@/lib/db-helpers'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId

    const users = await getUsersCollection()
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get wallet
    const wallets = await getWalletsCollection()
    const wallet = await wallets.findOne({ userId })

    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        username: user.username,
        email: user.email,
        country: user.country,
        countryCode: user.countryCode,
        phone: user.phone,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      wallet: wallet ? {
        balance: wallet.balance,
        pendingDeposits: wallet.pendingDeposits,
        pendingWithdrawals: wallet.pendingWithdrawals,
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

export const GET = withAuth(handler)
