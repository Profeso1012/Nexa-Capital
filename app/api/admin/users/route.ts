import { NextResponse } from 'next/server'
import { withAdmin, AuthenticatedRequest } from '@/lib/api-middleware'
import { getUsersCollection, getWalletsCollection } from '@/lib/db-helpers'

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const users = await getUsersCollection()
    
    const query: any = {}
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit
    const total = await users.countDocuments(query)
    
    const results = await users
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get wallet for each user
    const wallets = await getWalletsCollection()
    const usersWithWallets = await Promise.all(
      results.map(async (user) => {
        const wallet = await wallets.findOne({ userId: user._id!.toString() })
        return {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          country: user.country,
          phone: user.phone,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          wallet: wallet ? {
            balance: wallet.balance,
            pendingDeposits: wallet.pendingDeposits,
            pendingWithdrawals: wallet.pendingWithdrawals,
            totalEarnings: wallet.totalEarnings,
            totalDeposits: wallet.totalDeposits,
            totalWithdrawals: wallet.totalWithdrawals
          } : null
        }
      })
    )

    return NextResponse.json({
      users: usersWithWallets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
