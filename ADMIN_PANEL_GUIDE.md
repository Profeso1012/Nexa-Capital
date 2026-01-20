# 🔐 Admin Panel Complete Guide

## 🎯 Admin Login Credentials

**Email:** `<YOUR_ADMIN_EMAIL>`  
**Password:** `<YOUR_ADMIN_PASSWORD>`

**How to Login:**
1. Go to your deployed URL `/login` (e.g., `https://your-site.netlify.app/login`)
2. Enter the admin credentials above
3. Click "Login"
4. You'll be automatically redirected to `/admin` (the admin panel)

---

## 📊 Admin Panel Features

### 1. Dashboard (`/admin`)
**What You Can See:**
- ✅ Total users count
- ✅ New users today
- ✅ Total platform balance
- ✅ Active investments count
- ✅ Total invested amount
- ✅ Pending deposits count
- ✅ Pending withdrawals count
- ✅ Financial overview (deposits, withdrawals, earnings)
- ✅ Quick action links

**Real Data:** All statistics are pulled from MongoDB in real-time

---

### 2. Users Management (`/admin/users`)
**What You Can See:**
- ✅ List of ALL registered users
- ✅ Username and email
- ✅ Country and phone number
- ✅ Referral code
- ✅ Who referred them
- ✅ Account creation date
- ✅ **Complete wallet information:**
  - Current balance
  - Pending deposits
  - Pending withdrawals
  - Total earnings
  - Total deposits
  - Total withdrawals

**Features:**
- ✅ Search users by username or email
- ✅ Pagination (20 users per page)
- ✅ Real-time data from MongoDB

**How to Use:**
1. Go to `/admin/users`
2. See all users in a table
3. Use search box to find specific users
4. Click through pages to see more users

---

### 3. Transactions Management (`/admin/transactions`)
**THIS IS THE MOST IMPORTANT PAGE - WHERE YOU APPROVE/REJECT DEPOSITS & WITHDRAWALS**

**What You Can See:**
- ✅ ALL transactions from all users
- ✅ Transaction type (DEPOSIT, WITHDRAWAL, EARNING, REFERRAL, INVESTMENT)
- ✅ Amount
- ✅ Payment method (BITCOIN, ETHEREUM, BANK_TRANSFER, etc.)
- ✅ Status (PENDING, COMPLETED, CANCELLED, FAILED)
- ✅ User information (username, email)
- ✅ Wallet address (for crypto)
- ✅ Reference number
- ✅ Description
- ✅ Timestamps

**Features:**
- ✅ Filter by status (Pending, Completed, Cancelled, All)
- ✅ Filter by type
- ✅ Pagination (50 transactions per page)
- ✅ **APPROVE button** - Approves pending transactions
- ✅ **REJECT button** - Rejects pending transactions

**How Approval Works:**

#### Approving a DEPOSIT:
1. User submits deposit request
2. Transaction status: PENDING
3. Amount added to `pendingDeposits` in wallet
4. **Admin clicks "Approve"**
5. API calls `/api/admin/transactions/[id]/approve`
6. Transaction status → COMPLETED
7. Amount moved from `pendingDeposits` to `balance`
8. `totalDeposits` increased
9. **User can now see money in their balance!**

#### Approving a WITHDRAWAL:
1. User submits withdrawal request
2. Transaction status: PENDING
3. Amount deducted from `balance`, added to `pendingWithdrawals`
4. **Admin clicks "Approve"**
5. API calls `/api/admin/transactions/[id]/approve`
6. Transaction status → COMPLETED
7. Amount moved from `pendingWithdrawals` to `totalWithdrawals`
8. **Withdrawal completed!**

#### Rejecting a DEPOSIT:
1. **Admin clicks "Reject"**
2. API calls `/api/admin/transactions/[id]/reject`
3. Transaction status → CANCELLED
4. Amount removed from `pendingDeposits`
5. **User's balance unchanged**

#### Rejecting a WITHDRAWAL:
1. **Admin clicks "Reject"**
2. API calls `/api/admin/transactions/[id]/reject`
3. Transaction status → CANCELLED
4. Amount refunded from `pendingWithdrawals` back to `balance`
5. **User gets their money back**

**How to Use:**
1. Go to `/admin/transactions`
2. Click "Pending" filter to see pending transactions
3. Review each transaction:
   - Check user details
   - Verify amount
   - Check payment method
   - Review wallet address (for crypto)
4. Click "Approve" ✅ to accept
5. Click "Reject" ❌ to decline
6. Transaction updates in real-time in MongoDB
7. User sees updated balance immediately

---

### 4. Investments Management (`/admin/investments`)
**What You Can See:**
- ✅ ALL investments from all users
- ✅ User information (username, email)
- ✅ Investment plan name
- ✅ Amount invested
- ✅ Daily rate
- ✅ Total earned so far
- ✅ Status (ACTIVE, COMPLETED, CANCELLED)
- ✅ Start date and end date
- ✅ Progress bar showing completion percentage

**Features:**
- ✅ Filter by status (Active, Completed, Cancelled, All)
- ✅ Pagination (50 investments per page)
- ✅ Real-time data from MongoDB

**How to Use:**
1. Go to `/admin/investments`
2. See all investments
3. Monitor active investments
4. Track earnings progress

---

## 🔄 Complete User Flow Example

### Scenario: User Makes a Deposit

1. **User Side:**
   - User goes to `/dashboard/wallet`
   - Clicks "Deposit"
   - Enters amount: $500
   - Selects method: BITCOIN
   - Enters wallet address
   - Clicks "Submit"

2. **What Happens in Database:**
   ```
   Transaction created:
   - type: DEPOSIT
   - amount: 500
   - status: PENDING
   - userId: user123
   
   Wallet updated:
   - pendingDeposits: +500
   ```

3. **Admin Side:**
   - Admin goes to `/admin/transactions`
   - Clicks "Pending" filter
   - Sees new deposit request
   - Reviews details
   - Clicks "Approve" ✅

4. **What Happens in Database:**
   ```
   Transaction updated:
   - status: COMPLETED
   
   Wallet updated:
   - balance: +500
   - totalDeposits: +500
   - pendingDeposits: -500
   ```

5. **User Side:**
   - User refreshes dashboard
   - Sees balance increased by $500
   - Can now invest or withdraw

---

## 🎯 Admin Workflow

### Daily Tasks:
1. **Check Dashboard** - See pending actions
2. **Review Pending Deposits** - Approve legitimate deposits
3. **Review Pending Withdrawals** - Approve withdrawal requests
4. **Monitor Active Investments** - Track platform performance
5. **Check New Users** - See who registered

### Approval Checklist:

**For Deposits:**
- ✅ Verify payment method
- ✅ Check wallet address (for crypto)
- ✅ Confirm amount is reasonable
- ✅ Check user history
- ✅ Approve or reject

**For Withdrawals:**
- ✅ Verify user has sufficient balance
- ✅ Check withdrawal amount
- ✅ Verify wallet address
- ✅ Check for suspicious activity
- ✅ Approve or reject

---

## 🔐 Security Features

1. **Admin-Only Access:**
   - Only users with `isAdmin: true` can access `/admin`
   - Regular users redirected to `/dashboard`
   - Protected by JWT authentication

2. **Token Verification:**
   - All admin API routes check for valid token
   - All admin API routes verify admin status
   - Unauthorized requests rejected

3. **Audit Trail:**
   - All transactions have timestamps
   - All updates tracked with `updatedAt`
   - Transaction history preserved

---

## 📱 Admin Panel Pages Summary

| Page | URL | Purpose | Real DB Operations |
|------|-----|---------|-------------------|
| Dashboard | `/admin` | Overview & stats | ✅ Reads from all collections |
| Users | `/admin/users` | View all users | ✅ Reads users + wallets |
| Transactions | `/admin/transactions` | **Approve/Reject** | ✅ Updates transactions + wallets |
| Investments | `/admin/investments` | Monitor investments | ✅ Reads investments + plans |

---

## 🎉 What's Already Built

✅ **Admin Dashboard** - Fully functional with real stats  
✅ **User Management** - View all users with wallet details  
✅ **Transaction Approval System** - Approve/reject with real DB updates  
✅ **Investment Monitoring** - Track all investments  
✅ **Search & Filters** - Find users and transactions easily  
✅ **Pagination** - Handle large datasets  
✅ **Real-time Updates** - All data from MongoDB  
✅ **Responsive Design** - Works on desktop and mobile  

---

## 🚀 How to Start Using Admin Panel

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Login as admin:**
   - Go to your deployed URL `/login`
   - Email: `<YOUR_ADMIN_EMAIL>`
   - Password: `<YOUR_ADMIN_PASSWORD>`

3. **You'll be redirected to `/admin`**

4. **Explore the features:**
   - Click "Users" to see all registered users
   - Click "Transactions" to approve/reject deposits
   - Click "Investments" to monitor investments

5. **Test the approval system:**
   - Register a test user
   - Login as that user
   - Make a deposit request
   - Logout and login as admin
   - Go to Transactions → Pending
   - Approve the deposit
   - Logout and login as test user
   - See balance updated!

---

## 💡 Tips

- **Pending transactions** show up with a yellow clock icon
- **Completed transactions** show up with a green dot
- **Cancelled transactions** show up in red
- Use the **filter buttons** to quickly find pending items
- **Search box** in Users page helps find specific users
- All changes are **instant** - no page refresh needed after approval

---

## 🆘 Troubleshooting

**Can't login as admin?**
- Make sure you ran `npm run db:seed`
- Check credentials match your environment variables (ADMIN_EMAIL / ADMIN_PASSWORD)

**Not seeing transactions?**
- Make sure users have submitted transactions
- Check the filter - click "All" to see everything

**Approve button not working?**
- Check browser console for errors
- Make sure you're logged in as admin
- Verify token is valid

---

## 🎯 Summary

Your admin panel is **100% functional** with:
- Real MongoDB database operations
- Approve/reject system that updates balances
- User management with full details
- Investment monitoring
- Transaction tracking
- Search and filters
- Pagination
- Real-time updates

Everything is connected and working! 🚀
