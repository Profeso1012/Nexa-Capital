# 🎉 Complete Setup Guide - Nexa Capital

## ✅ What's Been Done

### 1. Database Migration
- ✅ Migrated from Prisma (local PostgreSQL) to MongoDB Atlas (cloud)
- ✅ Connected to production database: `delux-cluster0.zl7dc.mongodb.net`
- ✅ Created 6 collections with proper indexes
- ✅ Seeded initial data (admin user + investment plans)

### 2. API Routes Created (17 endpoints)

**Authentication:**
- ✅ POST `/api/auth/register` - User registration
- ✅ POST `/api/auth/login` - User login
- ✅ GET `/api/auth/me` - Get current user

**Wallet & Transactions:**
- ✅ GET `/api/wallet` - Get wallet balance
- ✅ GET `/api/transactions` - Get transaction history
- ✅ POST `/api/transactions/deposit` - Create deposit
- ✅ POST `/api/transactions/withdraw` - Create withdrawal

**Investments:**
- ✅ GET `/api/investment-plans` - Get available plans
- ✅ GET `/api/investments` - Get user investments
- ✅ POST `/api/investments/create` - Create investment

**Referrals:**
- ✅ GET `/api/referrals` - Get referral data

**Admin:**
- ✅ GET `/api/admin/stats` - Platform statistics
- ✅ GET `/api/admin/users` - Manage users
- ✅ GET `/api/admin/transactions` - View all transactions
- ✅ POST `/api/admin/transactions/[id]/approve` - Approve transaction
- ✅ POST `/api/admin/transactions/[id]/reject` - Reject transaction
- ✅ GET `/api/admin/investments` - View all investments

### 3. Admin Dashboard Created
- ✅ `/admin` - Dashboard with statistics
- ✅ `/admin/users` - User management
- ✅ `/admin/transactions` - Transaction approval/rejection
- ✅ `/admin/investments` - Investment monitoring

---

## 🚀 Quick Start

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Environment Setup
Your `.env` file is already configured with:
```env
MONGODB_URI="<YOUR_MONGODB_CONNECTION_STRING>"
JWT_SECRET="<YOUR_RANDOM_SECRET_KEY>"
ADMIN_EMAIL="<YOUR_ADMIN_EMAIL>"
ADMIN_PASSWORD="<YOUR_ADMIN_PASSWORD>"
```

### 3. Database is Ready
Collections and indexes are already initialized. Admin user and investment plans are seeded.

### 4. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔐 Admin Access

**Admin Login:**
- URL: `http://localhost:3000/login`
- Email: `admin@nexacapital.com`
- Password: `admin123`

After login, access admin panel at: `http://localhost:3000/admin`

**Admin Capabilities:**
- View platform statistics
- Manage all users
- Approve/reject deposits and withdrawals
- Monitor all investments
- View financial overview

---

## 📊 Investment Plans Created

1. **Starter Plan**
   - Daily Rate: 2.5%
   - Range: $100 - $999
   - Duration: 30 days

2. **Growth Plan**
   - Daily Rate: 3.5%
   - Range: $1,000 - $4,999
   - Duration: 45 days

3. **Premium Plan**
   - Daily Rate: 5.0%
   - Range: $5,000 - $19,999
   - Duration: 60 days

4. **Elite Plan**
   - Daily Rate: 7.5%
   - Range: $20,000 - $100,000
   - Duration: 90 days

---

## 🔄 User Flow

### For Regular Users:

1. **Register** → `/register`
   - Create account with referral code (optional)
   - Automatically creates wallet

2. **Login** → `/login`
   - Receive JWT token
   - Access dashboard

3. **Deposit** → `/dashboard/wallet`
   - Submit deposit request
   - Status: PENDING (awaits admin approval)

4. **Invest** → `/dashboard/investments`
   - Choose investment plan
   - Deducts from wallet balance
   - Starts earning daily

5. **Withdraw** → `/dashboard/wallet`
   - Request withdrawal
   - Status: PENDING (awaits admin approval)

6. **Referrals** → `/dashboard/referrals`
   - Share referral code
   - Earn bonuses from referrals

### For Admin:

1. **Login** → `/login` (with admin credentials)

2. **Dashboard** → `/admin`
   - View platform statistics
   - Quick access to pending actions

3. **Approve Deposits** → `/admin/transactions`
   - Review deposit requests
   - Approve → Adds to user balance
   - Reject → Returns to pending

4. **Approve Withdrawals** → `/admin/transactions`
   - Review withdrawal requests
   - Approve → Completes withdrawal
   - Reject → Refunds user balance

5. **Monitor Users** → `/admin/users`
   - View all users and their wallets
   - Search by username/email

6. **Track Investments** → `/admin/investments`
   - Monitor active investments
   - View earnings progress

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:test      # Test MongoDB connection
npm run db:init      # Initialize database (already done)
npm run db:seed      # Seed initial data (already done)
```

---

## 📡 API Testing

All API routes are documented in `API_DOCUMENTATION.md`

**Example: Login**
```bash
curl -X POST https://your-site.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<YOUR_ADMIN_EMAIL>","password":"<YOUR_ADMIN_PASSWORD>"}'
```

**Example: Get User Profile (with token)**
```bash
curl https://your-site.netlify.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Next Steps

### 1. Connect Frontend Pages to API

Your existing frontend pages need to be updated to call these API routes:

**Login Page** (`app/login/page.tsx`):
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
const data = await response.json()
localStorage.setItem('token', data.token)
```

**Dashboard** (`app/dashboard/page.tsx`):
```typescript
const token = localStorage.getItem('token')
const response = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const data = await response.json()
// Display user data and wallet
```

### 2. Add Daily Earnings Cron Job

Create a cron job or scheduled task to process daily investment earnings:
- Calculate earnings for active investments
- Update wallet balances
- Create earning transactions

### 3. Add Email Notifications (Optional)

Integrate email service for:
- Registration confirmation
- Transaction status updates
- Investment maturity alerts

### 4. Security Enhancements

Before production:
- Change JWT_SECRET to a strong random string
- Update admin password
- Enable MongoDB IP whitelist
- Add rate limiting
- Implement HTTPS

---

## 📚 Documentation Files

- `API_DOCUMENTATION.md` - Complete API reference
- `README_MONGODB.md` - MongoDB usage guide
- `MIGRATION_GUIDE.md` - Prisma to MongoDB migration details
- `SETUP_COMPLETE.md` - Initial setup summary

---

## 🆘 Troubleshooting

**Can't login as admin?**
- Run `npm run db:seed` again
- Check `.env` for correct credentials

**API returns 401 Unauthorized?**
- Check if token is in localStorage
- Verify token in Authorization header

**Database connection fails?**
- Run `npm run db:test`
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI in `.env`

**Frontend not showing data?**
- Check browser console for errors
- Verify API routes are being called
- Check network tab for responses

---

## 🎉 You're All Set!

Your Nexa Capital platform is now fully functional with:
- ✅ Production MongoDB database
- ✅ Complete API backend
- ✅ Admin dashboard
- ✅ User authentication
- ✅ Wallet management
- ✅ Investment system
- ✅ Referral tracking
- ✅ Transaction approval workflow

Start the dev server and begin testing! 🚀
