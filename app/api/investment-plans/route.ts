import { NextRequest, NextResponse } from 'next/server'
import { getInvestmentPlansCollection } from '@/lib/db-helpers'

export async function GET(req: NextRequest) {
  try {
    const plans = await getInvestmentPlansCollection()
    
    const results = await plans
      .find({ isActive: true })
      .sort({ minAmount: 1 })
      .toArray()

    return NextResponse.json({
      plans: results.map(p => ({
        id: p._id!.toString(),
        name: p.name,
        badge: p.badge,
        description: p.description,
        dailyRate: p.dailyRate,
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        duration: p.duration,
        isActive: p.isActive
      }))
    })

  } catch (error) {
    console.error('Get investment plans error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
