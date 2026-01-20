'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Filter } from 'lucide-react'

interface Transaction {
  id: string
  userId: string
  user: {
    username: string
    email: string
  } | null
  type: string
  amount: number
  method: string
  status: string
  reference?: string
  walletAddress?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('PENDING')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = filter === 'all' 
        ? '/api/admin/transactions'
        : `/api/admin/transactions?status=${filter}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessing(id)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/transactions/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error approving transaction:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/transactions/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      COMPLETED: 'default',
      CANCELLED: 'destructive',
      FAILED: 'destructive'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      DEPOSIT: 'bg-green-500/10 text-green-500',
      WITHDRAWAL: 'bg-red-500/10 text-red-500',
      EARNING: 'bg-blue-500/10 text-blue-500',
      REFERRAL: 'bg-purple-500/10 text-purple-500',
      INVESTMENT: 'bg-orange-500/10 text-orange-500'
    }
    return (
      <Badge className={colors[type] || ''} variant="outline">
        {type}
      </Badge>
    )
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Manage user transactions</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'PENDING' ? 'default' : 'outline'}
          onClick={() => setFilter('PENDING')}
        >
          Pending
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
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>
            {transactions.length} transaction(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(txn.type)}
                    {getStatusBadge(txn.status)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(txn.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-medium">
                    {txn.user?.username || 'Unknown User'} ({txn.user?.email})
                  </div>
                  <div className="text-2xl font-bold">
                    ${txn.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Method: {txn.method}
                    {txn.walletAddress && ` • ${txn.walletAddress}`}
                    {txn.reference && ` • Ref: ${txn.reference}`}
                  </div>
                  {txn.description && (
                    <div className="text-sm text-muted-foreground">
                      {txn.description}
                    </div>
                  )}
                </div>

                {txn.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(txn.id)}
                      disabled={processing === txn.id}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(txn.id)}
                      disabled={processing === txn.id}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
