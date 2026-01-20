import { NextResponse } from 'next/server'
import { withAdmin, AuthenticatedRequest } from '@/lib/api-middleware'
import { getInvestmentsCollection, getInvestmentPlansCollection, getUsersCollection } from '@/lib/db-helpers'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const investments = await getInvestmentsCollection()
    
    const query: any = {}
    if (status) query.status = status

    const skip = (page - 1) * limit
    const total = await investments.countDocuments(query)
    
    const results = await investments
      .find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get user and plan details
    const users = await getUsersCollection()
    const plans = await getInvestmentPlansCollection()
    
    const investmentsWithDetails = await Promise.all(
      results.map(async (inv) => {
        const user = await users.findOne(
          { _id: new ObjectId(inv.userId) },
          { projection: { username: 1, email: 1 } }
        )
        const plan = await plans.findOne({ _id: new ObjectId(inv.planId) })
        
        return {
          id: inv._id!.toString(),
          userId: inv.userId,
          user: user ? {
            username: user.username,
            email: user.email
          } : null,
          planName: plan?.name || 'Unknown',
          amount: inv.amount,
          dailyRate: inv.dailyRate,
          totalEarned: inv.totalEarned,
          status: inv.status,
          startDate: inv.startDate,
          endDate: inv.endDate,
          lastEarningDate: inv.lastEarningDate,
          createdAt: inv.createdAt
        }
      })
    )

    return NextResponse.json({
      investments: investmentsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
