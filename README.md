# Nexa Capital - Investment Platform

A full-stack investment platform built with Next.js 15, MongoDB Atlas, and TypeScript.

## 🎯 Features

### User Features
- ✅ User registration and authentication (JWT)
- ✅ Wallet management (deposits, withdrawals, balance tracking)
- ✅ Multiple investment plans with daily returns
- ✅ Referral system with bonus tracking
- ✅ Transaction history
- ✅ Real-time investment monitoring

### Admin Features
- ✅ Complete admin dashboard
- ✅ User management and monitoring
- ✅ Transaction approval/rejection system
- ✅ Investment tracking
- ✅ Platform statistics and analytics
- ✅ Financial overview

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (already configured)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment is already configured:**
The `.env` file is set up with MongoDB Atlas connection.

3. **Database is ready:**
Collections, indexes, admin user, and investment plans are already initialized.

4. **Start development server:**
```bash
npm run dev
```

5. **Access the application:**
- Frontend: Your deployed URL
- Admin Panel: `/admin` route

### Admin Login
Use the credentials you set in your environment variables (ADMIN_EMAIL and ADMIN_PASSWORD).

## 📁 Project Structure

```
nexa-v8/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── wallet/            # Wallet endpoints
│   │   ├── transactions/      # Transaction endpoints
│   │   ├── investments/       # Investment endpoints
│   │   ├── referrals/         # Referral endpoints
│   │   └── admin/             # Admin endpoints
│   ├── admin/                 # Admin dashboard pages
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── users/            # User management
│   │   ├── transactions/     # Transaction management
│   │   └── investments/      # Investment monitoring
│   ├── dashboard/            # User dashboard pages
│   ├── login/                # Login page
│   └── register/             # Registration page
├── lib/
│   ├── mongodb.ts            # MongoDB connection
│   ├── types.ts              # TypeScript types
│   ├── db-helpers.ts         # Database helper functions
│   ├── auth.ts               # Authentication utilities
│   └── api-middleware.ts     # API middleware
├── scripts/
│   ├── init-db.js            # Database initialization
│   ├── test-connection.js    # Connection test
│   └── seed-data.js          # Seed initial data
└── components/               # React components
```

## 🗄️ Database

**Provider:** MongoDB Atlas (Cloud)  
**Database:** nexa_capital  
**Collections:**
- users - User accounts
- wallets - User wallet balances
- transactions - All transactions
- investment_plans - Available plans
- investments - User investments
- referrals - Referral relationships

## 🔌 API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/investment-plans` - Get investment plans

### Protected Routes (User)
- `GET /api/auth/me` - Get current user
- `GET /api/wallet` - Get wallet balance
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions/deposit` - Create deposit
- `POST /api/transactions/withdraw` - Create withdrawal
- `GET /api/investments` - Get user investments
- `POST /api/investments/create` - Create investment
- `GET /api/referrals` - Get referral data

### Admin Routes
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `POST /api/admin/transactions/[id]/approve` - Approve transaction
- `POST /api/admin/transactions/[id]/reject` - Reject transaction
- `GET /api/admin/investments` - Get all investments

See `API_DOCUMENTATION.md` for complete API reference.

## 💼 Investment Plans

| Plan | Daily Rate | Min Amount | Max Amount | Duration |
|------|-----------|------------|------------|----------|
| Starter | 2.5% | $100 | $999 | 30 days |
| Growth | 3.5% | $1,000 | $4,999 | 45 days |
| Premium | 5.0% | $5,000 | $19,999 | 60 days |
| Elite | 7.5% | $20,000 | $100,000 | 90 days |

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:test      # Test MongoDB connection
npm run db:init      # Initialize database
npm run db:seed      # Seed initial data
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes with middleware
- Admin-only routes with role verification
- MongoDB connection with SSL/TLS

## 📚 Documentation

- `COMPLETE_SETUP_GUIDE.md` - Complete setup instructions
- `API_DOCUMENTATION.md` - Full API reference
- `README_MONGODB.md` - MongoDB usage guide
- `MIGRATION_GUIDE.md` - Database migration details

## 🎯 User Workflow

1. **Register** → Create account (optionally with referral code)
2. **Deposit** → Submit deposit request (awaits admin approval)
3. **Invest** → Choose plan and invest funds
4. **Earn** → Receive daily returns automatically
5. **Withdraw** → Request withdrawal (awaits admin approval)
6. **Refer** → Share referral code and earn bonuses

## 👨‍💼 Admin Workflow

1. **Login** → Access admin panel
2. **Monitor** → View platform statistics
3. **Approve Deposits** → Review and approve user deposits
4. **Approve Withdrawals** → Review and approve withdrawals
5. **Manage Users** → View and manage all users
6. **Track Investments** → Monitor active investments

## 🌐 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas
- **Authentication:** JWT, bcryptjs
- **UI:** Tailwind CSS, Radix UI
- **Validation:** Zod

## 📝 Environment Variables

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=your-deployed-url
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
DAILY_EARNING_HOUR=0
DEFAULT_REFERRAL_CODE=NEXA001
REFERRAL_BONUS_PERCENTAGE=5
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Ensure Node.js 18+ support
- Set environment variables
- Run `npm run build && npm run start`

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for Nexa Capital**
