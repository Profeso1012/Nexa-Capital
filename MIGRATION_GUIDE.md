# MongoDB Migration Guide

## ✅ Completed Steps

### 1. Database Setup
- ✅ Installed MongoDB driver (`mongodb` package)
- ✅ Created MongoDB connection client (`lib/mongodb.ts`)
- ✅ Created TypeScript types for all collections (`lib/types.ts`)
- ✅ Created database helper functions (`lib/db-helpers.ts`)
- ✅ Updated environment variables (`.env` and `.env.example`)
- ✅ Initialized database with collections and indexes

### 2. Connection Details
**Database Name:** `nexa_capital`

**Collections Created:**
- `users` - User accounts with authentication
- `wallets` - User wallet balances and totals
- `transactions` - All financial transactions
- `investment_plans` - Available investment plans
- `investments` - User investments
- `referrals` - Referral relationships and bonuses

**Connection String:**
```
mongodb+srv://Profeso1012:Ez2bduu12b@delux-cluster0.zl7dc.mongodb.net/?appName=Delux-Cluster0
```

### 3. Available Scripts
```bash
npm run db:test      # Test MongoDB connection
npm run db:init      # Initialize database (create collections & indexes)
```

## 📝 Next Steps for API Routes

When creating API routes, use the following pattern:

### Example: User Registration
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection, getWalletsCollection } from '@/lib/db-helpers'
import { hashPassword, generateReferralCode } from '@/lib/auth'
import { User, Wallet } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, country, countryCode, phone, referredBy } = body
    
    const users = await getUsersCollection()
    
    // Check if user exists
    const existingUser = await users.findOne({ 
      $or: [{ email }, { username }] 
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }
    
    // Create user
    const hashedPassword = await hashPassword(password)
    const referralCode = generateReferralCode(username)
    
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      country,
      countryCode,
      phone,
      referralCode,
      referredBy: referredBy || undefined,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await users.insertOne(newUser)
    
    // Create wallet
    const wallets = await getWalletsCollection()
    const newWallet: Wallet = {
      userId: result.insertedId.toString(),
      balance: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await wallets.insertOne(newWallet)
    
    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertedId
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Example: Get User Data
```typescript
import { ObjectId } from 'mongodb'
import { getUsersCollection } from '@/lib/db-helpers'

export async function GET(req: NextRequest) {
  try {
    const userId = req.user?.userId // from auth middleware
    
    const users = await getUsersCollection()
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // exclude password
    )
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 🔄 Key Differences from Prisma

### 1. ID Fields
- Prisma: `id: string` (UUID)
- MongoDB: `_id: ObjectId`

When querying by ID:
```typescript
import { ObjectId } from 'mongodb'

// Convert string ID to ObjectId
const user = await users.findOne({ _id: new ObjectId(userId) })

// Convert ObjectId to string
const userIdString = user._id.toString()
```

### 2. Queries
```typescript
// Find one
await users.findOne({ email: 'user@example.com' })

// Find many
await users.find({ isAdmin: false }).toArray()

// Insert
await users.insertOne(newUser)

// Update
await users.updateOne(
  { _id: new ObjectId(userId) },
  { $set: { updatedAt: new Date() } }
)

// Delete
await users.deleteOne({ _id: new ObjectId(userId) })
```

### 3. Relationships
MongoDB doesn't have built-in relations. Use manual lookups:

```typescript
// Get user with wallet
const user = await users.findOne({ _id: new ObjectId(userId) })
const wallet = await wallets.findOne({ userId: userId })

// Or use aggregation
const result = await users.aggregate([
  { $match: { _id: new ObjectId(userId) } },
  {
    $lookup: {
      from: 'wallets',
      localField: '_id',
      foreignField: 'userId',
      as: 'wallet'
    }
  }
]).toArray()
```

## 🗑️ Cleanup (Optional)

You can now remove Prisma-related files:
```bash
# Remove Prisma files
rm -rf prisma/
rm prisma.config.ts

# Uninstall Prisma (if installed)
npm uninstall @prisma/client prisma
```

## 📚 Resources

- [MongoDB Node.js Driver Docs](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB Query Operators](https://www.mongodb.com/docs/manual/reference/operator/query/)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)
