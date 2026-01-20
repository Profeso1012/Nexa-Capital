import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string
  country: string
  countryCode: string
  phone: string
  referralCode: string
  referredBy?: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  _id?: ObjectId
  userId: string
  balance: number
  pendingDeposits: number
  pendingWithdrawals: number
  totalEarnings: number
  totalDeposits: number
  totalWithdrawals: number
  createdAt: Date
  updatedAt: Date
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  EARNING = 'EARNING',
  REFERRAL = 'REFERRAL',
  INVESTMENT = 'INVESTMENT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  SYSTEM = 'SYSTEM'
}

export interface Transaction {
  _id?: ObjectId
  userId: string
  type: TransactionType
  amount: number
  method: PaymentMethod
  status: TransactionStatus
  reference?: string
  walletAddress?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvestmentPlan {
  _id?: ObjectId
  name: string
  badge?: string
  description: string
  dailyRate: number
  minAmount: number
  maxAmount: number
  duration: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Investment {
  _id?: ObjectId
  userId: string
  planId: string
  amount: number
  dailyRate: number
  totalEarned: number
  status: InvestmentStatus
  startDate: Date
  endDate?: Date
  lastEarningDate?: Date
  createdAt: Date
  updatedAt: Date
}

export enum ReferralStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE'
}

export interface Referral {
  _id?: ObjectId
  referrerId: string
  referredUserId: string
  bonusEarned: number
  status: ReferralStatus
  createdAt: Date
  updatedAt: Date
}
