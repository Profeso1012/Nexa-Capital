import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getReferralsCollection, getUsersCollection } from '@/lib/db-helpers'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId

    const referrals = await getReferralsCollection()
    const results = await referrals
      .find({ referrerId: userId })
      .sort({ createdAt: -1 })
      .toArray()

    // Get referred user details
    const users = await getUsersCollection()
    const referralsWithUsers = await Promise.all(
      results.map(async (ref) => {
        const user = await users.findOne(
          { _id: new ObjectId(ref.referredUserId) },
          { projection: { username: 1, email: 1, createdAt: 1 } }
        )
        return {
          id: ref._id!.toString(),
          referredUser: user ? {
            username: user.username,
            email: user.email,
            joinedAt: user.createdAt
          } : null,
          bonusEarned: ref.bonusEarned,
          status: ref.status,
          createdAt: ref.createdAt
        }
      })
    )

    // Calculate totals
    const totalReferrals = results.length
    const totalBonus = results.reduce((sum, ref) => sum + ref.bonusEarned, 0)

    return NextResponse.json({
      referrals: referralsWithUsers,
      stats: {
        totalReferrals,
        totalBonus
      }
    })

  } catch (error) {
    console.error('Get referrals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
