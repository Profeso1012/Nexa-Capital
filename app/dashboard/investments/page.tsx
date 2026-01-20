"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InvestmentPlan {
  id: string
  name: string
  badge?: string
  description: string
  dailyRate: number
  minAmount: number
  maxAmount: number
  duration: number
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

interface WalletData {
  balance: number
}

export default function InvestmentsPage() {
  const router = useRouter()
  const [investAmount, setInvestAmount] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [wallet, setWallet] = useState<WalletData | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch investment plans
      const plansResponse = await fetch('/api/investment-plans')
      if (plansResponse.ok) {
        const plansData = await plansResponse.json()
        setPlans(plansData.plans)
      }

      // Fetch user investments
      const investmentsResponse = await fetch('/api/investments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (investmentsResponse.ok) {
        const investmentsData = await investmentsResponse.json()
        setInvestments(investmentsData.investments)
      }

      // Fetch wallet
      const walletResponse = await fetch('/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (walletResponse.ok) {
        const walletData = await walletResponse.json()
        setWallet(walletData.wallet)
      }

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInvest = async () => {
    if (!investAmount || !selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan and enter an amount",
        variant: "destructive",
      })
      return
    }

    const amount = parseFloat(investAmount)
    const plan = plans.find((p) => p.id === selectedPlan)

    if (!plan) {
      toast({
        title: "Error",
        description: "Invalid plan selected",
        variant: "destructive",
      })
      return
    }

    if (amount < plan.minAmount || amount > plan.maxAmount) {
      toast({
        title: "Invalid amount",
        description: `Amount must be between $${plan.minAmount} and $${plan.maxAmount}`,
        variant: "destructive",
      })
      return
    }

    if (wallet && amount > wallet.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds in your wallet",
        variant: "destructive",
      })
      return
    }

    setIsInvesting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Investment successful",
          description: `You have successfully invested $${amount} in ${plan.name}`,
        })
        setInvestAmount("")
        setSelectedPlan("")
        fetchData() // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create investment",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Investment error:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsInvesting(false)
    }
  }

  const calculateProgress = (investment: Investment) => {
    if (!investment.endDate) return 0
    const start = new Date(investment.startDate).getTime()
    const end = new Date(investment.endDate).getTime()
    const now = Date.now()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const getDaysActive = (startDate: string) => {
    return Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading investments...</p>
        </div>
      </div>
    )
  }

  const activeInvestments = investments.filter(inv => inv.status === 'ACTIVE')
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <p className="text-muted-foreground">Manage your investment plans and track your earnings</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Investments</TabsTrigger>
          <TabsTrigger value="new">New Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeInvestments.length > 0 ? (
            activeInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardHeader>
                  <CardTitle>{investment.planName}</CardTitle>
                  <CardDescription>Investment details and earnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Investment Amount</div>
                        <div className="text-2xl font-bold">${investment.amount.toFixed(2)}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Daily Rate</div>
                        <div className="text-2xl font-bold text-primary">{investment.dailyRate}%</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Total Earned</div>
                        <div className="text-2xl font-bold text-emerald-600">${investment.totalEarned.toFixed(2)}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Days Active</div>
                        <div className="text-2xl font-bold">{getDaysActive(investment.startDate)} days</div>
                      </div>
                    </div>
                  </div>

                  {investment.endDate && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{calculateProgress(investment).toFixed(0)}%</span>
                      </div>
                      <Progress value={calculateProgress(investment)} className="h-2" />
                    </div>
                  )}

                  <Alert>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <AlertTitle>Investment Performance</AlertTitle>
                    <AlertDescription>
                      You've earned ${investment.totalEarned.toFixed(2)}, which is a{" "}
                      {((investment.totalEarned / investment.amount) * 100).toFixed(2)}% return.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Investments</CardTitle>
                <CardDescription>You don't have any active investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start Investing Today</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose an investment plan and start earning daily returns.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Investment</CardTitle>
              <CardDescription>Choose a plan and start earning daily returns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Available Balance</AlertTitle>
                <AlertDescription>
                  You have ${wallet?.balance.toFixed(2) || '0.00'} available for investment.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="investment-plan">Select Investment Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger id="investment-plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} ({plan.dailyRate}% daily)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlan && (
                <div className="rounded-md bg-muted p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name} Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Minimum:</div>
                      <div className="font-medium">${plans.find((p) => p.id === selectedPlan)?.minAmount}</div>
                      <div>Maximum:</div>
                      <div className="font-medium">${plans.find((p) => p.id === selectedPlan)?.maxAmount}</div>
                      <div>Daily Rate:</div>
                      <div className="font-medium text-primary">{plans.find((p) => p.id === selectedPlan)?.dailyRate}%</div>
                      <div>Duration:</div>
                      <div className="font-medium">{plans.find((p) => p.id === selectedPlan)?.duration} days</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount (USD)</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                />
                {selectedPlan && investAmount && (
                  <div className="text-sm space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>Daily Earnings:</span>
                      <span className="font-medium text-emerald-600">
                        ${((parseFloat(investAmount) * (plans.find((p) => p.id === selectedPlan)?.dailyRate || 0)) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expected:</span>
                      <span className="font-medium text-emerald-600">
                        ${((parseFloat(investAmount) * (plans.find((p) => p.id === selectedPlan)?.dailyRate || 0) * (plans.find((p) => p.id === selectedPlan)?.duration || 0)) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleInvest} disabled={isInvesting} className="w-full">
                {isInvesting ? "Processing..." : "Create Investment"}
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={selectedPlan === plan.id ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.badge && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                      {plan.badge}
                    </span>
                  )}
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{plan.dailyRate}%</div>
                    <div className="text-sm text-muted-foreground">Daily Return</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Min:</span>
                      <span className="font-medium">${plan.minAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max:</span>
                      <span className="font-medium">${plan.maxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{plan.duration} days</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
