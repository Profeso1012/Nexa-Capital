"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Bitcoin, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WalletData {
  balance: number
  pendingDeposits: number
  pendingWithdrawals: number
  totalEarnings: number
  totalDeposits: number
  totalWithdrawals: number
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

export default function WalletPage() {
  const router = useRouter()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [depositMethod, setDepositMethod] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)
  
  // Card payment fields
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  
  // Bank withdrawal fields
  const [accountNumber, setAccountNumber] = useState("")
  const [bankCountry, setBankCountry] = useState("")
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      const walletResponse = await fetch('/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (walletResponse.ok) {
        const walletData = await walletResponse.json()
        setWallet(walletData.wallet)
      }

      const txnResponse = await fetch('/api/transactions?limit=20', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (txnResponse.ok) {
        const txnData = await txnResponse.json()
        setTransactions(txnData.transactions)
      }

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount || !depositMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate card fields if card payment is selected
    if (depositMethod === 'credit_card') {
      if (!cardNumber || !expiryDate || !cvv) {
        toast({
          title: "Error",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        return
      }
      
      // Redirect to card payment page
      router.push(`/dashboard/wallet/card-payment?amount=${depositAmount}&card=${cardNumber.slice(-4)}`)
      return
    }

    const amount = parseFloat(depositAmount)
    if (amount < 100) {
      toast({
        title: "Error",
        description: "Minimum deposit amount is $100",
        variant: "destructive",
      })
      return
    }

    setIsDepositLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: depositMethod.toUpperCase(),
          walletAddress: depositMethod === 'bitcoin' || depositMethod === 'ethereum' ? 'pending' : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Deposit initiated",
          description: `Your deposit of $${amount} has been submitted and is pending approval.`,
        })
        setDepositAmount("")
        setDepositMethod("")
        fetchWalletData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process deposit",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Deposit error:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDepositLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate bank transfer fields
    if (withdrawMethod === 'bank_transfer') {
      if (!accountNumber || !bankCountry) {
        toast({
          title: "Error",
          description: "Please fill in all bank details",
          variant: "destructive",
        })
        return
      }
    } else {
      // Validate crypto wallet address
      if (!withdrawAddress) {
        toast({
          title: "Error",
          description: "Please enter your wallet address",
          variant: "destructive",
        })
        return
      }
    }

    const amount = parseFloat(withdrawAmount)
    
    if (amount < 50) {
      toast({
        title: "Error",
        description: "Minimum withdrawal amount is $50",
        variant: "destructive",
      })
      return
    }

    if (wallet && amount > wallet.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds to make this withdrawal",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: withdrawMethod.toUpperCase(),
          walletAddress: withdrawMethod === 'bank_transfer' 
            ? `${bankCountry} - Account: ${accountNumber}` 
            : withdrawAddress
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Withdrawal requested",
          description: `Your withdrawal request of $${amount} has been submitted and is pending approval.`,
        })
        setWithdrawAmount("")
        setWithdrawMethod("")
        setWithdrawAddress("")
        setAccountNumber("")
        setBankCountry("")
        fetchWalletData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process withdrawal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsWithdrawLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    )
  }

  if (!wallet) return null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <p className="text-muted-foreground">Manage your funds, make deposits and withdrawals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal or investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.pendingDeposits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Deposits awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.pendingWithdrawals.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Withdrawals awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings from investments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deposit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add funds to your wallet to start investing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Deposits are processed within 24 hours. The minimum deposit amount is $100.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (USD)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount (min $100)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit-method">Payment Method</Label>
                <Select value={depositMethod} onValueChange={setDepositMethod}>
                  <SelectTrigger id="deposit-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {depositMethod === "bitcoin" && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start space-x-3">
                    <Bitcoin className="mt-0.5 h-5 w-5 text-amber-500" />
                    <div className="w-full">
                      <h4 className="text-sm font-medium">Bitcoin Deposit Address</h4>
                      <p className="text-sm font-mono mt-1 break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Send exactly ${depositAmount || '0'} worth of Bitcoin to this address. Your account will be credited after admin verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {depositMethod === "ethereum" && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 h-5 w-5 text-purple-500 font-bold">Ξ</div>
                    <div className="w-full">
                      <h4 className="text-sm font-medium">Ethereum Deposit Address</h4>
                      <p className="text-sm font-mono mt-1 break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Send exactly ${depositAmount || '0'} worth of Ethereum to this address. Your account will be credited after admin verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {depositMethod === "credit_card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '')
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                        setCardNumber(formatted)
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4)
                          }
                          setExpiryDate(value)
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleDeposit} disabled={isDepositLoading} className="w-full">
                {isDepositLoading ? "Processing..." : "Submit Deposit Request"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Withdraw funds from your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Withdrawals are processed within 24-48 hours. Minimum withdrawal is $50.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount (min $50)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Available: ${wallet.balance.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawMethod === "bank_transfer" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter your account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-country">Bank Country</Label>
                      <Select value={bankCountry} onValueChange={setBankCountry}>
                        <SelectTrigger id="bank-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="withdraw-address">Wallet Address</Label>
                  <Input
                    id="withdraw-address"
                    placeholder="Enter your wallet address"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleWithdraw} disabled={isWithdrawLoading} className="w-full">
                {isWithdrawLoading ? "Processing..." : "Submit Withdrawal Request"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="capitalize">{txn.type.toLowerCase()}</TableCell>
                        <TableCell className={txn.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-emerald-600'}>
                          {txn.type === 'WITHDRAWAL' ? '-' : '+'}${txn.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {txn.status.toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
