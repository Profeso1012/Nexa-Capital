import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getWalletsCollection } from '@/lib/db-helpers'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId

    const wallets = await getWalletsCollection()
    const wallet = await wallets.findOne({ userId })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      wallet: {
        balance: wallet.balance,
        pendingDeposits: wallet.pendingDeposits,
        pendingWithdrawals: wallet.pendingWithdrawals,
        totalEarnings: wallet.totalEarnings,
        totalDeposits: wallet.totalDeposits,
        totalWithdrawals: wallet.totalWithdrawals
      }
    })

  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
