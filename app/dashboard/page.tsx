"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

interface UserData {
  user: {
    id: string
    username: string
    email: string
    referralCode: string
  }
  wallet: {
    balance: number
    pendingDeposits: number
    pendingWithdrawals: number
    totalEarnings: number
    totalDeposits: number
    totalWithdrawals: number
  }
}

interface Transaction {
  id: string
  type: string
  amount: number
  method: string
  status: string
  description?: string
  createdAt: string
}

interface Investment {
  id: string
  planName: string
  amount: number
  dailyRate: number
  totalEarned: number
  status: string
  startDate: string
  endDate?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch user data and wallet
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!userResponse.ok) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      const userData = await userResponse.json()
      setUserData(userData)

      // Fetch transactions
      const txnResponse = await fetch('/api/transactions?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (txnResponse.ok) {
        const txnData = await txnResponse.json()
        setTransactions(txnData.transactions)
      }

      // Fetch investments
      const invResponse = await fetch('/api/investments?status=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (invResponse.ok) {
        const invData = await invResponse.json()
        setInvestments(invData.investments)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const referralLink = `${window.location.origin}/register?ref=${userData?.user.referralCode}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Referral link has been copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-emerald-500'
      case 'PENDING':
        return 'text-amber-500'
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpRight className="h-4 w-4 text-blue-700" />
      case 'WITHDRAWAL':
        return <ArrowDownRight className="h-4 w-4 text-red-700" />
      case 'EARNING':
      case 'REFERRAL':
      case 'INVESTMENT':
        return <TrendingUp className="h-4 w-4 text-purple-700" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-blue-100'
      case 'WITHDRAWAL':
        return 'bg-red-100'
      case 'EARNING':
        return 'bg-green-100'
      case 'REFERRAL':
        return 'bg-purple-100'
      case 'INVESTMENT':
        return 'bg-orange-100'
      default:
        return 'bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const activeInvestmentsCount = investments.filter(inv => inv.status === 'ACTIVE').length
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {userData.user.username}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userData.wallet.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {userData.wallet.pendingDeposits > 0 && `+$${userData.wallet.pendingDeposits.toFixed(2)} pending`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{activeInvestmentsCount} active plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">${userData.wallet.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userData.wallet.totalDeposits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime deposits</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent deposit and withdrawal activities</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left whitespace-nowrap pb-2 font-medium">Transaction</th>
                          <th className="text-right whitespace-nowrap pb-2 font-medium">Amount</th>
                          <th className="text-right whitespace-nowrap pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr key={txn.id} className="border-b">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getTypeColor(txn.type)}`}>
                                  {getTypeIcon(txn.type)}
                                </div>
                                <div>
                                  <div className="font-medium">{txn.type}</div>
                                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                                    {txn.description || txn.method}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className={`py-4 text-right whitespace-nowrap font-medium ${txn.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-emerald-600'}`}>
                              {txn.type === 'WITHDRAWAL' ? '-' : '+'}${txn.amount.toFixed(2)}
                            </td>
                            <td className="py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end">
                                <div className="flex items-center">
                                  {txn.status === 'PENDING' && <Clock className="h-4 w-4 text-amber-500 mr-1" />}
                                  {txn.status === 'COMPLETED' && <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>}
                                  <span className={getStatusColor(txn.status)}>{txn.status.toLowerCase()}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/dashboard/wallet">
                    <Button variant="outline" size="sm">
                      View All Transactions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Investment Overview</CardTitle>
                <CardDescription>Your active investment performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {investments.length > 0 ? (
                  investments.map((inv) => {
                    const daysActive = Math.floor((new Date().getTime() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    const totalDuration = inv.endDate ? Math.floor((new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 30
                    const progress = (daysActive / totalDuration) * 100

                    return (
                      <div key={inv.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{inv.planName}</div>
                          <div className="text-sm font-medium">${inv.amount.toFixed(2)}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Daily Rate</span>
                            <span className="font-medium">{inv.dailyRate}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Total Earned</span>
                            <span className="font-medium text-emerald-600">${inv.totalEarned.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Days Active</span>
                            <span>{daysActive} days</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.min(progress, 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active investments
                  </div>
                )}

                <div className="text-center">
                  <Link href="/dashboard/investments">
                    <Button variant="outline" size="sm">
                      View All Investments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link to earn bonuses on referrals' deposits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-2 overflow-x-auto">
                <div className="relative w-full">
                  <Input
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${userData.user.referralCode}`}
                    readOnly
                    className="pr-10 font-mono text-sm whitespace-nowrap"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full aspect-square"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
                <Button className="whitespace-nowrap" onClick={copyToClipboard}>
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Your Referral Code: {userData.user.referralCode}</h4>
                    <p className="text-sm text-muted-foreground">
                      When someone signs up using your referral link and makes a deposit, you'll receive a bonus of 5%
                      of their deposit amount.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Tracking and payments</h4>
                    <p className="text-sm text-muted-foreground">
                      All referral bonuses are automatically credited to your account and can be withdrawn at any time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
