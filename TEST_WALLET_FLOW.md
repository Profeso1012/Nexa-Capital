# 🧪 Test Wallet Flow - Verify Real Data

## ✅ Wallet Page IS Connected to Real MongoDB

The wallet page displays:
- `wallet.balance` - Real balance from MongoDB
- `wallet.pendingDeposits` - Real pending deposits
- `wallet.pendingWithdrawals` - Real pending withdrawals  
- `wallet.totalEarnings` - Real total earnings

## 🔍 Why It Might Show $0.00

**For a NEW user, this is CORRECT!**
- New users start with $0.00 balance
- No deposits yet = $0.00
- No earnings yet = $0.00
- This is REAL data from MongoDB, not fake!

## 🧪 Test the Complete Flow

### Step 1: Check Your Current Balance
1. Login to your account
2. Go to `/dashboard/wallet`
3. You should see:
   - Available Balance: $0.00 (if new user)
   - Pending Deposits: $0.00
   - Pending Withdrawals: $0.00
   - Total Earnings: $0.00

**This is REAL data from MongoDB!**

### Step 2: Make a Deposit
1. Click "Deposit" tab
2. Enter amount: `500`
3. Select method: `Bitcoin`
4. Click "Submit Deposit Request"
5. You should see toast: "Your deposit of $500 has been submitted and is pending approval"

**What happens in MongoDB:**
```javascript
// Transaction created:
{
  type: "DEPOSIT",
  amount: 500,
  status: "PENDING",
  userId: "your-user-id"
}

// Wallet updated:
{
  pendingDeposits: 500  // ← This increases!
}
```

6. Refresh the page
7. You should now see:
   - Available Balance: $0.00 (still)
   - **Pending Deposits: $500.00** ← Changed!
   - Pending Withdrawals: $0.00
   - Total Earnings: $0.00

### Step 3: Admin Approves Deposit
1. Logout
2. Login as admin:
   - Email: `admin@nexacapital.com`
   - Password: `admin123`
3. Go to `/admin/transactions`
4. Click "Pending" filter
5. You should see your $500 deposit
6. Click "Approve" ✅

**What happens in MongoDB:**
```javascript
// Transaction updated:
{
  status: "COMPLETED"  // ← Changed from PENDING
}

// Wallet updated:
{
  balance: 500,           // ← Money added!
  totalDeposits: 500,     // ← Total increased!
  pendingDeposits: 0      // ← Moved to balance!
}
```

### Step 4: Check Balance Again
1. Logout from admin
2. Login as your user
3. Go to `/dashboard/wallet`
4. You should now see:
   - **Available Balance: $500.00** ← Changed!
   - Pending Deposits: $0.00 ← Back to 0
   - Pending Withdrawals: $0.00
   - Total Earnings: $0.00

**This is REAL data from MongoDB!**

### Step 5: Make a Withdrawal
1. Click "Withdraw" tab
2. Enter amount: `100`
3. Select method: `Bitcoin`
4. Enter wallet address: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
5. Click "Submit Withdrawal Request"
6. You should see toast: "Your withdrawal request of $100 has been submitted"

**What happens in MongoDB:**
```javascript
// Transaction created:
{
  type: "WITHDRAWAL",
  amount: 100,
  status: "PENDING",
  walletAddress: "bc1q..."
}

// Wallet updated:
{
  balance: 400,              // ← Deducted immediately!
  pendingWithdrawals: 100    // ← Added to pending!
}
```

7. Refresh the page
8. You should now see:
   - **Available Balance: $400.00** ← Changed!
   - Pending Deposits: $0.00
   - **Pending Withdrawals: $100.00** ← Changed!
   - Total Earnings: $0.00

### Step 6: Admin Approves Withdrawal
1. Logout
2. Login as admin
3. Go to `/admin/transactions`
4. Click "Pending" filter
5. You should see your $100 withdrawal
6. Click "Approve" ✅

**What happens in MongoDB:**
```javascript
// Transaction updated:
{
  status: "COMPLETED"
}

// Wallet updated:
{
  balance: 400,              // ← Stays the same
  totalWithdrawals: 100,     // ← Total increased!
  pendingWithdrawals: 0      // ← Completed!
}
```

7. Logout from admin
8. Login as your user
9. Go to `/dashboard/wallet`
10. You should now see:
    - Available Balance: $400.00
    - Pending Deposits: $0.00
    - **Pending Withdrawals: $0.00** ← Back to 0
    - Total Earnings: $0.00

---

## 🔍 How to Verify It's Real Data

### Method 1: Check MongoDB Directly
1. Open MongoDB Compass or Atlas
2. Connect to your cluster
3. Database: `nexa_capital`
4. Collection: `wallets`
5. Find your user's wallet
6. You'll see the exact same numbers!

### Method 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Go to `/dashboard/wallet`
4. Look for request to `/api/wallet`
5. Click on it
6. Check the Response
7. You'll see the real data from MongoDB!

### Method 3: Check Transaction History
1. Go to "Transaction History" tab
2. You should see:
   - Your $500 deposit (COMPLETED)
   - Your $100 withdrawal (COMPLETED)
3. These are REAL transactions from MongoDB!

---

## 📊 Summary

**The wallet page IS showing real data!**

If you see $0.00, it's because:
1. You're a new user (correct!)
2. You haven't made any deposits yet (correct!)
3. You haven't earned anything yet (correct!)

**To see non-zero values:**
1. Make a deposit
2. Admin approves it
3. Balance updates to real amount
4. Make an investment
5. Earnings accumulate over time
6. All values update in real-time from MongoDB

**Every number you see is pulled from MongoDB in real-time!**

---

## 🎯 Quick Test Checklist

- [ ] Login as new user → See $0.00 (REAL data)
- [ ] Make deposit → See pending increase (REAL)
- [ ] Admin approves → See balance increase (REAL)
- [ ] Make withdrawal → See balance decrease (REAL)
- [ ] Check transaction history → See real transactions (REAL)
- [ ] Check MongoDB → See same numbers (REAL)

**Everything is connected and working!** 🚀

The wallet page fetches data from `/api/wallet` which queries MongoDB and returns your actual wallet document. No fake data!
