"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, CreditCard, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CardPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount') || '0'
  const cardLast4 = searchParams.get('card') || '****'
  
  const [otp, setOtp] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = async () => {
    if (!otp || otp.length < 4) {
      toast({
        title: "Error",
        description: "Please enter a valid OTP code",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/transactions/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            method: 'CREDIT_CARD',
            walletAddress: `Card ending in ${cardLast4}`
          })
        })

        const data = await response.json()

        if (response.ok) {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/dashboard/wallet')
          }, 2000)
        } else {
          toast({
            title: "Payment Failed",
            description: data.error || "Failed to process payment",
            variant: "destructive"
          })
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Payment error:', error)
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
      }
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Payment Successful!</h2>
                <p className="text-muted-foreground mt-2">
                  Your deposit of ${amount} has been processed successfully.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting you back to your wallet...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Secure Payment</CardTitle>
          <CardDescription className="text-center">
            Complete your payment securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold">${amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">•••• {cardLast4}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                A verification code has been sent to your registered mobile number and email. Please enter it below to complete the transaction.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code (OTP)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Button 
              onClick={handlePayment} 
              disabled={isProcessing || otp.length < 4}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Confirm Payment
                </>
              )}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
