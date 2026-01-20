import { NextResponse } from 'next/server'
import { withAdmin, AuthenticatedRequest } from '@/lib/api-middleware'
import { getTransactionsCollection, getWalletsCollection } from '@/lib/db-helpers'
import { TransactionStatus, TransactionType } from '@/lib/types'
import { ObjectId } from 'mongodb'

async function handler(
  req: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id

    const transactions = await getTransactionsCollection()
    const transaction = await transactions.findOne({ _id: new ObjectId(transactionId) })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      return NextResponse.json(
        { error: 'Transaction is not pending' },
        { status: 400 }
      )
    }

    // Update transaction status
    await transactions.updateOne(
      { _id: new ObjectId(transactionId) },
      { 
        $set: { 
          status: TransactionStatus.COMPLETED,
          updatedAt: new Date()
        } 
      }
    )

    // Update wallet based on transaction type
    const wallets = await getWalletsCollection()
    
    if (transaction.type === TransactionType.DEPOSIT) {
      await wallets.updateOne(
        { userId: transaction.userId },
        { 
          $inc: { 
            balance: transaction.amount,
            totalDeposits: transaction.amount,
            pendingDeposits: -transaction.amount
          },
          $set: { updatedAt: new Date() }
        }
      )
    } else if (transaction.type === TransactionType.WITHDRAWAL) {
      await wallets.updateOne(
        { userId: transaction.userId },
        { 
          $inc: { 
            totalWithdrawals: transaction.amount,
            pendingWithdrawals: -transaction.amount
          },
          $set: { updatedAt: new Date() }
        }
      )
    }

    return NextResponse.json({
      message: 'Transaction approved successfully',
      transaction: {
        id: transactionId,
        status: TransactionStatus.COMPLETED
      }
    })

  } catch (error) {
    console.error('Approve transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAdmin(handler)
