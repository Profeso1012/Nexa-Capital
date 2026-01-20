import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getInvestmentsCollection, getInvestmentPlansCollection, getWalletsCollection, getTransactionsCollection } from '@/lib/db-helpers'
import { Investment, InvestmentStatus, Transaction, TransactionType, TransactionStatus, PaymentMethod } from '@/lib/types'
import { ObjectId } from 'mongodb'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId
    const body = await req.json()
    const { planId, amount } = body

    // Validate input
    if (!planId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid plan or amount' },
        { status: 400 }
      )
    }

    // Get plan details
    const plans = await getInvestmentPlansCollection()
    const plan = await plans.findOne({ _id: new ObjectId(planId) })

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Investment plan not found or inactive' },
        { status: 404 }
      )
    }

    // Validate amount range
    const investAmount = parseFloat(amount)
    if (investAmount < plan.minAmount || investAmount > plan.maxAmount) {
      return NextResponse.json(
        { error: `Amount must be between ${plan.minAmount} and ${plan.maxAmount}` },
        { status: 400 }
      )
    }

    // Check wallet balance
    const wallets = await getWalletsCollection()
    const wallet = await wallets.findOne({ userId })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    if (wallet.balance < investAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + plan.duration)

    // Create investment
    const investments = await getInvestmentsCollection()
    const newInvestment: Investment = {
      userId,
      planId: planId,
      amount: investAmount,
      dailyRate: plan.dailyRate,
      totalEarned: 0,
      status: InvestmentStatus.ACTIVE,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await investments.insertOne(newInvestment)

    // Deduct from wallet
    await wallets.updateOne(
      { userId },
      { 
        $inc: { balance: -investAmount },
        $set: { updatedAt: new Date() }
      }
    )

    // Create transaction record
    const transactions = await getTransactionsCollection()
    const transaction: Transaction = {
      userId,
      type: TransactionType.INVESTMENT,
      amount: investAmount,
      method: PaymentMethod.SYSTEM,
      status: TransactionStatus.COMPLETED,
      description: `Investment in ${plan.name}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await transactions.insertOne(transaction)

    return NextResponse.json({
      message: 'Investment created successfully',
      investment: {
        id: result.insertedId.toString(),
        planName: plan.name,
        amount: investAmount,
        dailyRate: plan.dailyRate,
        duration: plan.duration,
        startDate,
        endDate
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
