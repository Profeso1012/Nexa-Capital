'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Investment {
  id: string
  userId: string
  user: {
    username: string
    email: string
  } | null
  planName: string
  amount: number
  dailyRate: number
  totalEarned: number
  status: string
  startDate: string
  endDate?: string
  lastEarningDate?: string
  createdAt: string
}

export default function AdminInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ACTIVE')

  useEffect(() => {
    fetchInvestments()
  }, [filter])

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = filter === 'all' 
        ? '/api/admin/investments'
        : `/api/admin/investments?status=${filter}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setInvestments(data.investments)
      }
    } catch (error) {
      console.error('Error fetching investments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      COMPLETED: 'secondary',
      CANCELLED: 'destructive'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  const calculateProgress = (investment: Investment) => {
    if (!investment.endDate) return 0
    const start = new Date(investment.startDate).getTime()
    const end = new Date(investment.endDate).getTime()
    const now = Date.now()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Investments</h1>
        <p className="text-muted-foreground">Monitor user investments</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'ACTIVE' ? 'default' : 'outline'}
          onClick={() => setFilter('ACTIVE')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'COMPLETED' ? 'default' : 'outline'}
          onClick={() => setFilter('COMPLETED')}
        >
          Completed
        </Button>
        <Button
          variant={filter === 'CANCELLED' ? 'default' : 'outline'}
          onClick={() => setFilter('CANCELLED')}
        >
          Cancelled
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment List</CardTitle>
          <CardDescription>
            {investments.length} investment(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((inv) => (
              <div
                key={inv.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{inv.planName}</span>
                      {getStatusBadge(inv.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {inv.user?.username || 'Unknown User'} ({inv.user?.email})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Started: {new Date(inv.startDate).toLocaleDateString()}
                      {inv.endDate && ` • Ends: ${new Date(inv.endDate).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${inv.amount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {inv.dailyRate}% daily
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Earned</div>
                    <div className="font-semibold text-green-600">
                      ${inv.totalEarned.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Expected Total</div>
                    <div className="font-semibold">
                      ${(inv.amount * (inv.dailyRate / 100) * (inv.endDate ? Math.ceil((new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0)).toFixed(2)}
                    </div>
                  </div>
                </div>

                {inv.status === 'ACTIVE' && inv.endDate && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{calculateProgress(inv).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress(inv)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {investments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No investments found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
