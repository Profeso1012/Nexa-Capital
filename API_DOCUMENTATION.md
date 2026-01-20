# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Routes

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "country": "USA",
  "countryCode": "+1",
  "phone": "1234567890",
  "referredBy": "REFER123" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "referralCode": "JOHN123"
  }
}
```

### POST /api/auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false,
    "referralCode": "JOHN123"
  }
}
```

### GET /api/investment-plans
Get all active investment plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Starter Plan",
      "badge": "Popular",
      "description": "Perfect for beginners",
      "dailyRate": 2.5,
      "minAmount": 100,
      "maxAmount": 999,
      "duration": 30,
      "isActive": true
    }
  ]
}
```

---

## Protected Routes (Require Authentication)

### GET /api/auth/me
Get current user profile and wallet.

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "country": "USA",
    "phone": "1234567890",
    "referralCode": "JOHN123",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "wallet": {
    "balance": 1000.00,
    "pendingDeposits": 0,
    "pendingWithdrawals": 0,
    "totalEarnings": 250.00,
    "totalDeposits": 1000.00,
    "totalWithdrawals": 250.00
  }
}
```

### GET /api/wallet
Get wallet information.

**Response:**
```json
{
  "wallet": {
    "balance": 1000.00,
    "pendingDeposits": 0,
    "pendingWithdrawals": 0,
    "totalEarnings": 250.00,
    "totalDeposits": 1000.00,
    "totalWithdrawals": 250.00
  }
}
```

### GET /api/transactions
Get user transactions.

**Query Parameters:**
- `type` (optional): DEPOSIT, WITHDRAWAL, EARNING, REFERRAL, INVESTMENT
- `status` (optional): PENDING, COMPLETED, FAILED, CANCELLED
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "transactions": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "DEPOSIT",
      "amount": 500.00,
      "method": "BITCOIN",
      "status": "PENDING",
      "reference": "TXN123",
      "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "description": "Deposit via BITCOIN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/transactions/deposit
Create a deposit request.

**Request Body:**
```json
{
  "amount": 500,
  "method": "BITCOIN",
  "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "reference": "TXN123" // optional
}
```

**Response:**
```json
{
  "message": "Deposit request submitted successfully",
  "transaction": {
    "id": "507f1f77bcf86cd799439011",
    "type": "DEPOSIT",
    "amount": 500.00,
    "method": "BITCOIN",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/transactions/withdraw
Create a withdrawal request.

**Request Body:**
```json
{
  "amount": 250,
  "method": "BITCOIN",
  "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

**Response:**
```json
{
  "message": "Withdrawal request submitted successfully",
  "transaction": {
    "id": "507f1f77bcf86cd799439011",
    "type": "WITHDRAWAL",
    "amount": 250.00,
    "method": "BITCOIN",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/investments
Get user investments.

**Query Parameters:**
- `status` (optional): ACTIVE, COMPLETED, CANCELLED

**Response:**
```json
{
  "investments": [
    {
      "id": "507f1f77bcf86cd799439011",
      "planId": "507f1f77bcf86cd799439012",
      "planName": "Starter Plan",
      "amount": 500.00,
      "dailyRate": 2.5,
      "totalEarned": 37.50,
      "status": "ACTIVE",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/investments/create
Create a new investment.

**Request Body:**
```json
{
  "planId": "507f1f77bcf86cd799439012",
  "amount": 500
}
```

**Response:**
```json
{
  "message": "Investment created successfully",
  "investment": {
    "id": "507f1f77bcf86cd799439011",
    "planName": "Starter Plan",
    "amount": 500.00,
    "dailyRate": 2.5,
    "duration": 30,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z"
  }
}
```

### GET /api/referrals
Get user referrals.

**Response:**
```json
{
  "referrals": [
    {
      "id": "507f1f77bcf86cd799439011",
      "referredUser": {
        "username": "jane_doe",
        "email": "jane@example.com",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      },
      "bonusEarned": 25.00,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalReferrals": 5,
    "totalBonus": 125.00
  }
}
```

---

## Admin Routes (Require Admin Authentication)

### GET /api/admin/stats
Get platform statistics.

**Response:**
```json
{
  "stats": {
    "users": {
      "total": 150,
      "newToday": 5
    },
    "transactions": {
      "pendingDeposits": 3,
      "pendingWithdrawals": 2
    },
    "financials": {
      "totalBalance": 50000.00,
      "totalDeposits": 75000.00,
      "totalWithdrawals": 20000.00,
      "totalEarnings": 5000.00,
      "totalInvested": 30000.00,
      "activeInvestments": 45
    }
  },
  "recentPendingTransactions": [...]
}
```

### GET /api/admin/users
Get all users with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `search` (optional): Search by username or email

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/admin/transactions
Get all transactions with pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `type` (optional): Filter by type
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)

**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "totalPages": 10
  }
}
```

### POST /api/admin/transactions/[id]/approve
Approve a pending transaction.

**Response:**
```json
{
  "message": "Transaction approved successfully",
  "transaction": {
    "id": "507f1f77bcf86cd799439011",
    "status": "COMPLETED"
  }
}
```

### POST /api/admin/transactions/[id]/reject
Reject a pending transaction.

**Response:**
```json
{
  "message": "Transaction rejected successfully",
  "transaction": {
    "id": "507f1f77bcf86cd799439011",
    "status": "CANCELLED"
  }
}
```

### GET /api/admin/investments
Get all investments with pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)

**Response:**
```json
{
  "investments": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 200,
    "totalPages": 4
  }
}
```

---

## Payment Methods
- `BITCOIN`
- `ETHEREUM`
- `BANK_TRANSFER`
- `CREDIT_CARD`
- `SYSTEM` (internal)

## Transaction Types
- `DEPOSIT` - User deposits funds
- `WITHDRAWAL` - User withdraws funds
- `EARNING` - Investment earnings
- `REFERRAL` - Referral bonus
- `INVESTMENT` - Investment purchase

## Transaction Status
- `PENDING` - Awaiting admin approval
- `COMPLETED` - Successfully processed
- `FAILED` - Processing failed
- `CANCELLED` - Rejected by admin

## Investment Status
- `ACTIVE` - Currently running
- `COMPLETED` - Finished successfully
- `CANCELLED` - Cancelled by admin

## Error Responses
All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
