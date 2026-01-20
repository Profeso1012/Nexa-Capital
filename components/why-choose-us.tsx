"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CreditCard, Award, Users, Shield } from "lucide-react"

export function WhyChooseUs() {
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
      icon: CreditCard,
      title: "Automatic and Manual Gateway",
      description:
        "Enjoy the flexibility of both automatic and manual payment gateways, ensuring seamless and efficient transactions.",
    },
    {
      icon: Award,
      title: "Ranking Badge System",
      description:
        "Earn and showcase your achievements with our ranking badge system, designed to recognize and reward your progress.",
    },
    {
      icon: Users,
      title: "Referral Level System",
      description:
        "Benefit from our multi-level referral system, which allows you to earn more as you expand your network.",
    },
    {
      icon: Shield,
      title: "Secure Application",
      description:
        "Our platform prioritizes security, ensuring that your data and transactions remain safe at all times.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="text-primary font-medium mb-2">WHY CHOOSE US</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Why You Will Choose Us.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vbBlBHcHoQBJmBGePiaX9dyb3T7pru.png"
              alt="Financial Analysis"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-primary/30 rounded-full"></div>
                <div className="absolute inset-4 bg-primary/40 rounded-full"></div>
                <div className="absolute inset-6 bg-primary/50 rounded-full"></div>
                <div className="absolute inset-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Nexa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {isMobile ? (
              <div className="overflow-y-auto max-h-[400px] pr-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    ref={(el) => (featureRefs.current[index] = el)}
                    className="flex items-start opacity-0 translate-y-8 transition-all duration-700 ease-out mb-6"
                    style={{ transitionDelay: `${150 * index}ms` }}
                  >
                    <div className="p-3 rounded-lg bg-primary/10 mr-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => (featureRefs.current[index] = el)}
                  className="flex items-start opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${150 * index}ms` }}
                >
                  <div className="p-3 rounded-lg bg-primary/10 mr-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
