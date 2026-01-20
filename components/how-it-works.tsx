"use client"

import { useEffect, useRef } from "react"
import { UserPlus, FileCheck, ShieldCheck, Wallet, TrendingUp, Users, ArrowRight, DollarSign } from "lucide-react"

export function HowItWorks() {
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
      title: "Register Account",
      description: "By registering this website you will be able to start your operation.",
    },
    {
      icon: FileCheck,
      title: "Verify Email",
      description: "After creating the account user need to verify the account through email.",
    },
    {
      icon: ShieldCheck,
      title: "Verify KYC",
      description: "Users' KYC needs to verify to before making any withdrawals.",
    },
    {
      icon: Wallet,
      title: "Deposit Money",
      description: "Users can deposit using any automatic or manual gateway.",
    },
    {
      icon: TrendingUp,
      title: "Investment Plan",
      description: "Users can invest in any plan or scheme to enjoy the profit which will add automatically.",
    },
    {
      icon: ArrowRight,
      title: "Transfer Money",
      description: "Users can transfer the fund to another user instantly.",
    },
    {
      icon: Users,
      title: "Refer to Friends",
      description: "For referring to any friend user can generate the bonus.",
    },
    {
      icon: DollarSign,
      title: "Withdraw and Enjoy",
      description: "Withdraws can be performed in the main wallet and it will take a few time to complete.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="text-primary font-medium mb-2">HOW IT WORKS</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The steps are describe how the <br />
            application works and what's inside
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.slice(0, 4).map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className="flex flex-col items-center text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {index < 3 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.slice(4).map((step, index) => (
            <div
              key={index + 4}
              ref={(el) => (stepRefs.current[index + 4] = el)}
              className="flex flex-col items-center text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${150 * (index + 4)}ms` }}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 5}
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {index < 3 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
