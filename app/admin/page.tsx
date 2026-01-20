'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react'

// Lazy load Card components
const Card = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.Card })))
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardContent })))
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardDescription })))
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardHeader })))
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardTitle })))

interface Stats {
  users: {
    total: number
    newToday: number
  }
  transactions: {
    pendingDeposits: number
    pendingWithdrawals: number
  }
  financials: {
    totalBalance: number
    totalDeposits: number
    totalWithdrawals: number
    totalEarnings: number
    totalInvested: number
    activeInvestments: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!stats) {
    return <div className="p-8">Failed to load stats</div>
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.users.newToday} new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.financials.totalBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.financials.activeInvestments}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.financials.totalInvested.toFixed(2)} invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.transactions.pendingDeposits + stats.transactions.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.transactions.pendingDeposits} deposits, {stats.transactions.pendingWithdrawals} withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Total platform financials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Deposits:</span>
              <span className="font-semibold">${stats.financials.totalDeposits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Withdrawals:</span>
              <span className="font-semibold">${stats.financials.totalWithdrawals.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Earnings Paid:</span>
              <span className="font-semibold">${stats.financials.totalEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Net Balance:</span>
              <span className="font-bold text-lg">
                ${(stats.financials.totalDeposits - stats.financials.totalWithdrawals - stats.financials.totalEarnings).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage platform operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/transactions" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Pending Transactions</div>
              <div className="text-sm text-muted-foreground">
                {stats.transactions.pendingDeposits + stats.transactions.pendingWithdrawals} awaiting approval
              </div>
            </a>
            <a 
              href="/admin/users" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">
                View and manage {stats.users.total} users
              </div>
            </a>
            <a 
              href="/admin/investments" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Active Investments</div>
              <div className="text-sm text-muted-foreground">
                {stats.financials.activeInvestments} investments running
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
