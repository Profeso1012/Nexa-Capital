import { NextResponse } from 'next/server'
import { withAdmin, AuthenticatedRequest } from '@/lib/api-middleware'
import { 
  getUsersCollection, 
  getWalletsCollection, 
  getTransactionsCollection,
  getInvestmentsCollection 
} from '@/lib/db-helpers'
import { TransactionStatus, TransactionType, InvestmentStatus } from '@/lib/types'

async function handler(req: AuthenticatedRequest) {
  try {
    const users = await getUsersCollection()
    const wallets = await getWalletsCollection()
    const transactions = await getTransactionsCollection()
    const investments = await getInvestmentsCollection()

    // Count users
    const totalUsers = await users.countDocuments()
    const newUsersToday = await users.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })

    // Pending transactions
    const pendingDeposits = await transactions.countDocuments({
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING
    })
    const pendingWithdrawals = await transactions.countDocuments({
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING
    })

    // Calculate total balances
    const walletsData = await wallets.find().toArray()
    const totalBalance = walletsData.reduce((sum, w) => sum + w.balance, 0)
    const totalDeposits = walletsData.reduce((sum, w) => sum + w.totalDeposits, 0)
    const totalWithdrawals = walletsData.reduce((sum, w) => sum + w.totalWithdrawals, 0)
    const totalEarnings = walletsData.reduce((sum, w) => sum + w.totalEarnings, 0)

    // Active investments
    const activeInvestments = await investments.countDocuments({
      status: InvestmentStatus.ACTIVE
    })
    const investmentsData = await investments.find({ status: InvestmentStatus.ACTIVE }).toArray()
    const totalInvested = investmentsData.reduce((sum, inv) => sum + inv.amount, 0)

    // Recent transactions
    const recentTransactions = await transactions
      .find({ status: TransactionStatus.PENDING })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday
        },
        transactions: {
          pendingDeposits,
          pendingWithdrawals
        },
        financials: {
          totalBalance,
          totalDeposits,
          totalWithdrawals,
          totalEarnings,
          totalInvested,
          activeInvestments
        }
      },
      recentPendingTransactions: recentTransactions.map(t => ({
        id: t._id!.toString(),
        userId: t.userId,
        type: t.type,
        amount: t.amount,
        method: t.method,
        status: t.status,
        createdAt: t.createdAt
      }))
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
