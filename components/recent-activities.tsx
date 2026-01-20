"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const recentInvestors = [
    {
      name: "Michael Smith",
      date: "Apr 24, 2023 21:07",
      amount: 1000,
      currency: "USD",
    },
    {
      name: "Sarah Johnson",
      date: "Apr 24, 2023 20:18",
      amount: 10000,
      currency: "USD",
    },
    {
      name: "David Wilson",
      date: "Apr 24, 2023 19:45",
      amount: 10000,
      currency: "USD",
    },
    {
      name: "Emma Davis",
      date: "Apr 24, 2023 18:38",
      amount: 500,
      currency: "USD",
    },
    {
      name: "James Brown",
      date: "Apr 24, 2023 18:14",
      amount: 150,
      currency: "USD",
    },
    {
      name: "Olivia Miller",
      date: "Apr 24, 2023 17:33",
      amount: 15000,
      currency: "USD",
    },
  ]

  const recentWithdraws = [
    {
      name: "Robert Taylor",
      date: "Apr 24, 2023 22:15",
      amount: 5000,
      currency: "USD",
    },
    {
      name: "Jennifer Clark",
      date: "Apr 24, 2023 21:42",
      amount: 2500,
      currency: "USD",
    },
    {
      name: "William Moore",
      date: "Apr 24, 2023 20:57",
      amount: 7500,
      currency: "USD",
    },
    {
      name: "Elizabeth White",
      date: "Apr 24, 2023 19:23",
      amount: 1200,
      currency: "USD",
    },
    {
      name: "Thomas Harris",
      date: "Apr 24, 2023 18:49",
      amount: 3000,
      currency: "USD",
    },
    {
      name: "Jessica Martin",
      date: "Apr 24, 2023 17:15",
      amount: 8500,
      currency: "USD",
    },
  ]

  const renderInvestorItem = (investor: (typeof recentInvestors)[0], index: number) => (
    <div key={`investor-${index}`} className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-3 bg-primary/10">
          <AvatarFallback className="text-primary font-medium">
            {investor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{investor.name}</div>
          <div className="text-xs text-muted-foreground">{investor.date}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">TO USD</div>
        <div className="font-medium text-emerald-500">
          {investor.amount.toLocaleString()} {investor.currency}
        </div>
      </div>
    </div>
  )

  const renderWithdrawItem = (withdraw: (typeof recentWithdraws)[0], index: number) => (
    <div key={`withdraw-${index}`} className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-3 bg-primary/10">
          <AvatarFallback className="text-primary font-medium">
            {withdraw.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{withdraw.name}</div>
          <div className="text-xs text-muted-foreground">{withdraw.date}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">TO USD</div>
        <div className="font-medium text-emerald-500">
          {withdraw.amount.toLocaleString()} {withdraw.currency}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="text-primary font-medium mb-2">LATEST INVESTORS AND WITHDRAWS</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            You can explore the live investments <br />
            and withdraws
          </h2>
        </div>

        {isMobile ? (
          <Tabs defaultValue="investors">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="investors">Recent Investors</TabsTrigger>
              <TabsTrigger value="withdraws">Recent Withdraws</TabsTrigger>
            </TabsList>
            <TabsContent value="investors">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Investors</CardTitle>
                  <CardDescription>Latest investment activities on our platform</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {recentInvestors.map((investor, index) => renderInvestorItem(investor, index))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="withdraws">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Withdraws</CardTitle>
                  <CardDescription>Latest withdrawal activities on our platform</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {recentWithdraws.map((withdraw, index) => renderWithdrawItem(withdraw, index))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Investors</CardTitle>
                <CardDescription>Latest investment activities on our platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {recentInvestors.map((investor, index) => renderInvestorItem(investor, index))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Withdraws</CardTitle>
                <CardDescription>Latest withdrawal activities on our platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {recentWithdraws.map((withdraw, index) => renderWithdrawItem(withdraw, index))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
