import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getTransactionsCollection } from '@/lib/db-helpers'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const transactions = await getTransactionsCollection()
    
    const query: any = { userId }
    if (type) query.type = type
    if (status) query.status = status

    const results = await transactions
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      transactions: results.map(t => ({
        id: t._id!.toString(),
        type: t.type,
        amount: t.amount,
        method: t.method,
        status: t.status,
        reference: t.reference,
        walletAddress: t.walletAddress,
        description: t.description,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
