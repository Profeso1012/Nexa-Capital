"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Shield, TrendingUp, Users, Clock, CreditCard, BarChart4 } from "lucide-react"

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
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

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: "Daily Earnings",
      description: "Earn up to 7% daily returns on your investments with our tiered investment plans.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your investments are protected with enterprise-grade security and encryption.",
    },
    {
      icon: Users,
      title: "Referral Program",
      description: "Earn additional income by referring friends and family to our platform.",
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Our team monitors market conditions around the clock to maximize your returns.",
    },
    {
      icon: CreditCard,
      title: "Easy Withdrawals",
      description: "Request withdrawals at any time and receive your funds within 24 hours.",
    },
    {
      icon: BarChart4,
      title: "Performance Tracking",
      description: "Track your investment performance with detailed analytics and reports.",
    },
  ]

  const renderFeatureCard = (feature, index) => (
    <div
      key={index}
      ref={(el) => (featureRefs.current[index] = el)}
      className="flex flex-col p-6 rounded-lg border bg-white dark:bg-card opacity-0 translate-y-8 transition-all duration-700 ease-out feature-card-hover group"
      style={{ transitionDelay: `${200 * (index % 3)}ms` }}
    >
      <div className="p-3 rounded-full bg-primary/10 mb-4 self-start transition-colors duration-300 group-hover:bg-primary">
        <feature.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
      </div>
      <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  )

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Nexa Capital</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide a secure and reliable platform for growing your wealth with professional investment strategies.
          </p>
        </div>

        {isMobile ? (
          <div className="mobile-scroll-container">
            <div className="mobile-scroll-content">
              {features.slice(0, 6).map((feature, index) => renderFeatureCard(feature, index))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => renderFeatureCard(feature, index))}
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            ref={(el) => (featureRefs.current[6] = el)}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Professional Investment Management</h3>
            <p className="text-muted-foreground mb-6">
              Our team of financial experts manages your investments using proven strategies to maximize returns while
              minimizing risk. We leverage market opportunities to ensure consistent growth of your portfolio.
            </p>
            <ul className="space-y-3">
              {[
                "Expert market analysis and investment selection",
                "Diversified portfolio management",
                "Risk mitigation strategies",
                "Transparent reporting and performance tracking",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={(el) => (featureRefs.current[7] = el)}
            className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wvUCeJfoVb8uJlE4LfIRVYGFWgl5C3.png"
              alt="Professional Investment Management"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
