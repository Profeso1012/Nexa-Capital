'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  country: string
  phone: string
  referralCode: string
  referredBy?: string
  isAdmin: boolean
  createdAt: string
  wallet: {
    balance: number
    pendingDeposits: number
    pendingWithdrawals: number
    totalEarnings: number
    totalDeposits: number
    totalWithdrawals: number
  } | null
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {filteredUsers.length} user(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{user.username}</span>
                      {user.isAdmin && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.country} • {user.phone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Referral Code</div>
                    <div className="font-mono font-semibold">{user.referralCode}</div>
                    {user.referredBy && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Referred by: {user.referredBy}
                      </div>
                    )}
                  </div>
                </div>

                {user.wallet && (
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                      <div className="font-semibold">${user.wallet.balance.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Deposits</div>
                      <div className="font-semibold text-green-600">
                        ${user.wallet.totalDeposits.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Withdrawals</div>
                      <div className="font-semibold text-red-600">
                        ${user.wallet.totalWithdrawals.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Earnings</div>
                      <div className="font-semibold text-blue-600">
                        ${user.wallet.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pending Deposits</div>
                      <div className="font-semibold text-yellow-600">
                        ${user.wallet.pendingDeposits.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pending Withdrawals</div>
                      <div className="font-semibold text-orange-600">
                        ${user.wallet.pendingWithdrawals.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
