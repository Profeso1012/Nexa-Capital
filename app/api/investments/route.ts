import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getInvestmentsCollection, getInvestmentPlansCollection } from '@/lib/db-helpers'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const investments = await getInvestmentsCollection()
    
    const query: any = { userId }
    if (status) query.status = status

    const results = await investments
      .find(query)
      .sort({ startDate: -1 })
      .toArray()

    // Get plan details for each investment
    const plans = await getInvestmentPlansCollection()
    const investmentsWithPlans = await Promise.all(
      results.map(async (inv) => {
        const plan = await plans.findOne({ _id: new ObjectId(inv.planId) })
        return {
          id: inv._id!.toString(),
          planId: inv.planId,
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
      investments: investmentsWithPlans
    })

  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
