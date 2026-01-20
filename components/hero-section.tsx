"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

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

    if (headingRef.current) observer.observe(headingRef.current)
    if (paragraphRef.current) observer.observe(paragraphRef.current)
    if (buttonsRef.current) observer.observe(buttonsRef.current)

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current)
      if (paragraphRef.current) observer.unobserve(paragraphRef.current)
      if (buttonsRef.current) observer.unobserve(buttonsRef.current)
    }
  }, [])

  return (
    <section className="relative py-20 pb-24 md:py-32 md:pb-36 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-di2clVI17PgcxEbmW5Q2SPEVtAVJz5.png"
          alt="Business meeting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-background/40"></div>
      </div>

      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            Welcome to the <span className="text-primary">Largest</span> <br />
            E-Finance System
          </h1>
          <p
            ref={paragraphRef}
            className="text-xl text-muted-foreground mb-8 opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
          >
            Nexa Capital Limited is a trusted wealth-building platform offering reliable daily earnings, secure
            investment plans, and professional financial tools tailored for your long-term success.
          </p>
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16 opacity-0 translate-y-8 transition-all duration-700 delay-400 ease-out"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Investment Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="wave-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  )
}
