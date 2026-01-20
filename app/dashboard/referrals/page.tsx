"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Copy, Check, Share2, ArrowUpRight, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Referral {
  id: string
  referredUser: {
    username: string
    email: string
    joinedAt: string
  } | null
  bonusEarned: number
  status: string
  createdAt: string
}

interface ReferralStats {
  totalReferrals: number
  totalBonus: number
}

export default function ReferralsPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats>({ totalReferrals: 0, totalBonus: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Get user data for referral code
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setReferralCode(userData.user.referralCode)
      }

      // Get referrals
      const referralsResponse = await fetch('/api/referrals', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json()
        setReferrals(referralsData.referrals)
        setStats(referralsData.stats)
      }

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${referralCode}`
    : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Referral link has been copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join Nexa Capital",
          text: "Join Nexa Capital and start earning daily returns on your investments!",
          url: referralLink,
        })
        .then(() => {
          toast({
            title: "Shared successfully",
            description: "Your referral link has been shared.",
          })
        })
        .catch(() => {
          copyToClipboard()
        })
    } else {
      copyToClipboard()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading referrals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Referrals</h2>
        <p className="text-muted-foreground">Invite friends and earn bonuses on their deposits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">People who joined using your link</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBonus.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total earnings from referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Bonus</CardTitle>
            <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5% of Deposits</div>
            <p className="text-xs text-muted-foreground">Earn 5% of your referrals' deposits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn referral bonuses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <div className="truncate text-sm">{referralLink}</div>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy link</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={copyToClipboard} className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button onClick={shareReferralLink} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Your Referral Code: {referralCode}</AlertTitle>
            <AlertDescription>
              When someone signs up using your referral link and makes a deposit, you'll receive a bonus of 5% of their
              deposit amount. There's no limit to how many people you can refer.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>People who have joined using your referral link</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Your Bonus</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{referral.referredUser?.username || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{referral.referredUser?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {referral.referredUser?.joinedAt 
                          ? new Date(referral.referredUser.joinedAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-emerald-600">${referral.bonusEarned.toFixed(2)}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            referral.status === 'ACTIVE'
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {referral.status === 'ACTIVE' ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
                          {referral.status === 'ACTIVE' ? "Active" : "Pending"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Referrals Yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Share your referral link with friends and family to start earning bonuses on their deposits.
              </p>
              <Button onClick={shareReferralLink}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Your Referral Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
