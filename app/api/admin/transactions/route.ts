import { NextResponse } from 'next/server'
import { withAdmin, AuthenticatedRequest } from '@/lib/api-middleware'
import { getTransactionsCollection, getUsersCollection } from '@/lib/db-helpers'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const transactions = await getTransactionsCollection()
    
    const query: any = {}
    if (status) query.status = status
    if (type) query.type = type

    const skip = (page - 1) * limit
    const total = await transactions.countDocuments(query)
    
    const results = await transactions
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get user details for each transaction
    const users = await getUsersCollection()
    const transactionsWithUsers = await Promise.all(
      results.map(async (txn) => {
        const user = await users.findOne(
          { _id: new ObjectId(txn.userId) },
          { projection: { username: 1, email: 1 } }
        )
        return {
          id: txn._id!.toString(),
          userId: txn.userId,
          user: user ? {
            username: user.username,
            email: user.email
          } : null,
          type: txn.type,
          amount: txn.amount,
          method: txn.method,
          status: txn.status,
          reference: txn.reference,
          walletAddress: txn.walletAddress,
          description: txn.description,
          createdAt: txn.createdAt,
          updatedAt: txn.updatedAt
        }
      })
    )

    return NextResponse.json({
      transactions: transactionsWithUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
