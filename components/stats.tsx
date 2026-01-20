"use client"

import { useEffect, useRef, useState } from "react"
import { Users, DollarSign, TrendingUp, Award } from "lucide-react"

interface CounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

function Counter({ end, duration = 2000, prefix = "", suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const currentCount = Math.floor(progress * end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [end, duration, isVisible])

  return (
    <span ref={countRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current?.classList.add("animate-in")
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="py-16 bg-white dark:bg-muted/50">
      <div ref={sectionRef} className="container opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <Counter end={15000} suffix="+" />
            </h3>
            <p className="text-sm text-muted-foreground">Active Investors</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <Counter end={25} prefix="$" suffix="M+" />
            </h3>
            <p className="text-sm text-muted-foreground">Total Investments</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <Counter end={7} suffix="%" />
            </h3>
            <p className="text-sm text-muted-foreground">Daily Returns</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <Counter end={5} suffix="+" />
            </h3>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}
