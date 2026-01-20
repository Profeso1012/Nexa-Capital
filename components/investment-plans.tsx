"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lightbulb, Trophy, Building, BookOpen, Briefcase, BarChart4, DollarSign } from "lucide-react"

export function InvestmentPlans({ showAll = false }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const planRefs = useRef<(HTMLDivElement | null)[]>([])
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

    planRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      planRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const plans = [
    {
      id: "bronze",
      name: "Starter Plan",
      badge: "BRONZE",
      badgeColor: "bg-[#CD7F32] text-white",
      icon: Lightbulb,
      description: "Perfect for beginners starting their investment journey",
      dailyRate: "1.2%",
      minAmount: 50,
      maxAmount: 499,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
    {
      id: "silver",
      name: "Beginner Investment",
      badge: "SILVER",
      badgeColor: "bg-[#C0C0C0] text-white",
      icon: Building,
      description: "Start building your wealth with our beginner-friendly plan",
      dailyRate: "1.5%",
      minAmount: 500,
      maxAmount: 999,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
    {
      id: "gold",
      name: "Growth Investment",
      badge: "GOLD",
      badgeColor: "bg-[#FFD700] text-black",
      icon: Trophy,
      description: "Accelerate your wealth growth with higher daily returns",
      dailyRate: "2.0%",
      minAmount: 1000,
      maxAmount: 4999,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: true,
      buttonColor: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    {
      id: "platinum",
      name: "Growth Advanced",
      badge: "PLATINUM",
      badgeColor: "bg-[#E5E4E2] text-black",
      icon: BarChart4,
      description: "Advanced investment strategy for experienced investors",
      dailyRate: "2.5%",
      minAmount: 5000,
      maxAmount: 9999,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
    {
      id: "diamond",
      name: "Gold Investment",
      badge: "DIAMOND",
      badgeColor: "bg-[#b9f2ff] text-black",
      icon: BookOpen,
      description: "Premium investment plan with exceptional daily returns",
      dailyRate: "3.0%",
      minAmount: 10000,
      maxAmount: 49999,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
    {
      id: "sapphire",
      name: "Executive Investment",
      badge: "SAPPHIRE",
      badgeColor: "bg-[#0F52BA] text-white",
      icon: Briefcase,
      description: "Executive-level investment with premium daily returns",
      dailyRate: "3.5%",
      minAmount: 50000,
      maxAmount: 99999,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
    {
      id: "emerald",
      name: "Business Expansion",
      badge: "EMERALD",
      badgeColor: "bg-[#50C878] text-black",
      icon: DollarSign,
      description: "Our highest tier plan for serious wealth builders",
      dailyRate: "4.0%",
      minAmount: 100000,
      maxAmount: 1000000,
      period: "Daily",
      capitalBack: "No",
      returnType: "Lifetime",
      numberOfPeriod: "Unlimited",
      profitWithdraw: "Anytime",
      popular: false,
      buttonColor: "bg-transparent hover:bg-white/10 text-white border border-white/20",
    },
  ]

  const renderPlanCard = (plan: (typeof plans)[0], index: number) => (
    <div
      key={plan.id}
      id={plan.id}
      ref={(el) => (planRefs.current[index] = el)}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out bg-[#0f172a] rounded-lg overflow-hidden border border-[#1e293b] hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
      style={{
        transitionDelay: `${200 * (index % 4)}ms`,
        minWidth: isMobile ? "280px" : "auto",
      }}
    >
      <div className={`w-full py-2 px-4 ${plan.badgeColor}`}>{plan.badge}</div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-blue-500/10 mr-3">
            <plan.icon className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        </div>
        <p className="text-gray-400 mb-4 text-sm">{plan.description}</p>

        <div className="bg-blue-500/10 text-blue-500 rounded-md px-3 py-2 mb-6 inline-block font-bold">
          Daily {plan.dailyRate}
        </div>

        <div className="space-y-2 mb-6 text-gray-300">
          <div className="flex justify-between">
            <span>Investment</span>
            <span className="text-white font-medium">${plan.minAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Capital Back</span>
            <span className="text-white font-medium">{plan.capitalBack}</span>
          </div>
          <div className="flex justify-between">
            <span>Return Type</span>
            <span className="text-white font-medium">{plan.returnType}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of Period</span>
            <span className="text-white font-medium">{plan.numberOfPeriod}</span>
          </div>
          <div className="flex justify-between">
            <span>Profit Withdraw</span>
            <span className="text-white font-medium">{plan.profitWithdraw}</span>
          </div>
        </div>

        <Link href="/register">
          <Button className={`w-full ${plan.buttonColor}`}>Invest Now</Button>
        </Link>
      </div>
    </div>
  )

  return (
    <section id="plans" className="py-20 bg-[#0f172a]">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Investment <span className="text-blue-500">Plans</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the investment plan that best suits your financial goals and start earning daily returns.
          </p>
        </div>

        {isMobile ? (
          <div className="overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex space-x-4 py-2" style={{ width: "max-content" }}>
              {plans.slice(0, showAll ? plans.length : 4).map((plan, index) => renderPlanCard(plan, index))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(showAll ? plans : plans.slice(0, 4)).map((plan, index) => renderPlanCard(plan, index))}
          </div>
        )}

        {!showAll && (
          <div className="mt-12 text-center">
            <Link href="/plans">
              <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                View All Plans
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
