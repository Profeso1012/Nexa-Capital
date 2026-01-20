"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Target, TrendingUp, Shield, Users } from "lucide-react"

export function OurMission() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

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

    contentRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      contentRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const values = [
    {
      icon: Target,
      title: "Mission",
      description:
        "Our mission is to democratize access to high-quality investment opportunities, enabling individuals worldwide to build wealth and achieve financial freedom.",
    },
    {
      icon: TrendingUp,
      title: "Vision",
      description:
        "We envision a world where everyone has the tools and knowledge to grow their wealth and secure their financial future, regardless of their background or starting point.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We operate with the highest standards of integrity and transparency, ensuring that our clients' interests always come first in everything we do.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We believe in building a supportive community of investors who can learn from each other and grow together on their financial journey.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            ref={(el) => (contentRefs.current[0] = el)}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Nexa Capital Limited, we're driven by a passion for helping individuals achieve financial success
              through smart investments. Our team of financial experts is dedicated to providing reliable investment
              opportunities that generate consistent returns for our clients.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Founded in 2018, we've grown from a small startup to a trusted investment platform serving clients
              worldwide. Our success is built on our commitment to transparency, security, and exceptional customer
              service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 rounded-lg border bg-white dark:bg-card feature-card-hover"
                >
                  <div className="p-2 rounded-full bg-primary/10 mb-3 self-start">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={(el) => (contentRefs.current[1] = el)}
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wvUCeJfoVb8uJlE4LfIRVYGFWgl5C3.png"
              alt="Nexa Capital Team Meeting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Our Leadership Team</h3>
                <p className="text-muted-foreground">Experienced professionals dedicated to your financial success</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
