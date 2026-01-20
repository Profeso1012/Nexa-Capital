# MongoDB Setup - Nexa Capital

## 🎉 Migration Complete!

Your application has been successfully migrated from Prisma to MongoDB Atlas.

## 🔗 Connection Info

**Database:** `nexa_capital`  
**Provider:** MongoDB Atlas  
**Cluster:** Delux-Cluster0

## 📦 Collections

Your database includes the following collections:

1. **users** - User accounts and authentication
2. **wallets** - User wallet balances and transaction totals
3. **transactions** - All deposit, withdrawal, and earning records
4. **investment_plans** - Available investment plans
5. **investments** - Active and completed user investments
6. **referrals** - Referral relationships and bonuses

## 🚀 Quick Start

### Test Connection
```bash
npm run db:test
```

### Initialize Database (if needed)
```bash
npm run db:init
```

## 💻 Usage in Code

### Import Collections
```typescript
import { getUsersCollection, getWalletsCollection } from '@/lib/db-helpers'
import { User, Wallet } from '@/lib/types'
```

### Query Examples

**Find a user:**
```typescript
const users = await getUsersCollection()
const user = await users.findOne({ email: 'user@example.com' })
```

**Create a user:**
```typescript
const newUser: User = {
  username: 'john_doe',
  email: 'john@example.com',
  password: hashedPassword,
  country: 'USA',
  countryCode: '+1',
  phone: '1234567890',
  referralCode: 'JOHN123',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

const result = await users.insertOne(newUser)
console.log('User ID:', result.insertedId)
```

**Update a user:**
```typescript
import { ObjectId } from 'mongodb'

await users.updateOne(
  { _id: new ObjectId(userId) },
  { 
    $set: { 
      phone: '9876543210',
      updatedAt: new Date() 
    } 
  }
)
```

**Find with conditions:**
```typescript
const activeInvestments = await investments
  .find({ 
    status: 'ACTIVE',
    userId: userId 
  })
  .sort({ startDate: -1 })
  .toArray()
```

## 🔐 Environment Variables

Make sure your `.env` file contains:

```env
MONGODB_URI="mongodb+srv://Profeso1012:Ez2bduu12b@delux-cluster0.zl7dc.mongodb.net/?appName=Delux-Cluster0"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 📚 Key Files

- `lib/mongodb.ts` - MongoDB connection client
- `lib/types.ts` - TypeScript interfaces for all collections
- `lib/db-helpers.ts` - Helper functions to access collections
- `lib/auth.ts` - Authentication utilities (JWT, password hashing)
- `scripts/init-db.js` - Database initialization script
- `scripts/test-connection.js` - Connection test script

## 🔄 Migration from Prisma

### Main Changes:
1. **IDs**: Changed from UUID strings to MongoDB ObjectId
   - Use `new ObjectId(id)` when querying
   - Use `_id.toString()` to get string representation

2. **Queries**: Native MongoDB queries instead of Prisma syntax
   - `findOne()`, `find()`, `insertOne()`, `updateOne()`, etc.

3. **Relations**: Manual lookups or aggregation pipelines
   - No automatic relation loading
   - Use `$lookup` for joins in aggregation

4. **Decimals**: Changed from Prisma Decimal to JavaScript numbers
   - Be careful with floating-point precision for money

## 🌐 Production Ready

This setup is production-ready and can handle multiple concurrent connections:

✅ Connection pooling enabled  
✅ Indexes created for optimal performance  
✅ Unique constraints on critical fields  
✅ Global singleton pattern for Next.js  
✅ Environment-based configuration  

## 📖 Resources

- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Query Operators](https://www.mongodb.com/docs/manual/reference/operator/query/)

## 🆘 Troubleshooting

**Connection Issues:**
- Verify your IP is whitelisted in MongoDB Atlas
- Check that the password in MONGODB_URI is correct
- Ensure network connectivity

**Type Errors:**
- Make sure to import types from `@/lib/types`
- Use `ObjectId` from `mongodb` package for ID conversions

**Query Issues:**
- Remember to call `.toArray()` on `find()` results
- Use `$set` operator for updates
- Check MongoDB query syntax documentation
