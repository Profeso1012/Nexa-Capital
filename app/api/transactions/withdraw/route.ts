import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware'
import { getTransactionsCollection, getWalletsCollection } from '@/lib/db-helpers'
import { Transaction, TransactionType, TransactionStatus, PaymentMethod } from '@/lib/types'

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId
    const body = await req.json()
    const { amount, method, walletAddress } = body

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!method || !Object.values(PaymentMethod).includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    if (!walletAddress && (method === PaymentMethod.BITCOIN || method === PaymentMethod.ETHEREUM)) {
      return NextResponse.json(
        { error: 'Wallet address is required for crypto withdrawals' },
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

    if (wallet.balance < parseFloat(amount)) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Create transaction
    const transactions = await getTransactionsCollection()
    const newTransaction: Transaction = {
      userId,
      type: TransactionType.WITHDRAWAL,
      amount: parseFloat(amount),
      method,
      status: TransactionStatus.PENDING,
      walletAddress: walletAddress || undefined,
      description: `Withdrawal via ${method}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await transactions.insertOne(newTransaction)

    // Update wallet
    await wallets.updateOne(
      { userId },
      { 
        $inc: { 
          balance: -parseFloat(amount),
          pendingWithdrawals: parseFloat(amount)
        },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      transaction: {
        id: result.insertedId.toString(),
        type: newTransaction.type,
        amount: newTransaction.amount,
        method: newTransaction.method,
        status: newTransaction.status,
        createdAt: newTransaction.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
