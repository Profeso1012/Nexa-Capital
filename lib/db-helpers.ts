import { Collection } from 'mongodb'
import { getDb } from './mongodb'
import {
  User,
  Wallet,
  Transaction,
  InvestmentPlan,
  Investment,
  Referral
} from './types'

export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDb()
  return db.collection<User>('users')
}

export async function getWalletsCollection(): Promise<Collection<Wallet>> {
  const db = await getDb()
  return db.collection<Wallet>('wallets')
}

export async function getTransactionsCollection(): Promise<Collection<Transaction>> {
  const db = await getDb()
  return db.collection<Transaction>('transactions')
}

export async function getInvestmentPlansCollection(): Promise<Collection<InvestmentPlan>> {
  const db = await getDb()
  return db.collection<InvestmentPlan>('investment_plans')
}

export async function getInvestmentsCollection(): Promise<Collection<Investment>> {
  const db = await getDb()
  return db.collection<Investment>('investments')
}

export async function getReferralsCollection(): Promise<Collection<Referral>> {
  const db = await getDb()
  return db.collection<Referral>('referrals')
}

// Initialize indexes for better query performance
export async function initializeIndexes() {
  const users = await getUsersCollection()
  await users.createIndex({ email: 1 }, { unique: true })
  await users.createIndex({ username: 1 }, { unique: true })
  await users.createIndex({ referralCode: 1 }, { unique: true })

  const wallets = await getWalletsCollection()
  await wallets.createIndex({ userId: 1 }, { unique: true })

  const transactions = await getTransactionsCollection()
  await transactions.createIndex({ userId: 1 })
  await transactions.createIndex({ status: 1 })
  await transactions.createIndex({ type: 1 })
  await transactions.createIndex({ createdAt: -1 })

  const investmentPlans = await getInvestmentPlansCollection()
  await investmentPlans.createIndex({ name: 1 }, { unique: true })

  const investments = await getInvestmentsCollection()
  await investments.createIndex({ userId: 1 })
  await investments.createIndex({ status: 1 })
  await investments.createIndex({ startDate: -1 })

  const referrals = await getReferralsCollection()
  await referrals.createIndex({ referrerId: 1 })
  await referrals.createIndex({ referredUserId: 1 }, { unique: true })

  console.log('Database indexes initialized successfully')
}
