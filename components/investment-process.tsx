"use client"

import { useEffect, useRef } from "react"
import { UserPlus, FileCheck, ShieldCheck, Wallet, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function InvestmentProcess() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

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

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const steps = [
    {
      icon: UserPlus,
      title: "Create an Account",
      description: "Sign up for a free account on our platform. It only takes a few minutes to get started.",
    },
    {
      icon: FileCheck,
      title: "Verify Your Identity",
      description:
        "Complete our KYC verification process to ensure the security of our platform and comply with regulations.",
    },
    {
      icon: Wallet,
      title: "Deposit Funds",
      description: "Add funds to your account using your preferred payment method. We accept various payment options.",
    },
    {
      icon: TrendingUp,
      title: "Choose an Investment Plan",
      description: "Select an investment plan that aligns with your financial goals and risk tolerance.",
    },
    {
      icon: ShieldCheck,
      title: "Monitor Your Investments",
      description: "Track your investments and earnings through your personalized dashboard.",
    },
    {
      icon: ArrowRight,
      title: "Withdraw Your Earnings",
      description: "Withdraw your earnings at any time. Withdrawals are processed within 24-48 hours.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-muted/30">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Start Investing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to start your investment journey with Nexa Capital Limited.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className="flex flex-col p-6 rounded-lg border bg-white dark:bg-card opacity-0 translate-y-8 transition-all duration-700 ease-out feature-card-hover"
              style={{ transitionDelay: `${150 * (index % 3)}ms` }}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/register">
            <Button size="lg">
              Start Investing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
