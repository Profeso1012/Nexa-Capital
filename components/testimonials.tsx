"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Retail Investor",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "Nexa Capital has transformed my approach to investing. The daily returns are consistent, and the platform is incredibly user-friendly. I've recommended it to all my friends and family.",
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "As a business owner, I appreciate the transparency and reliability of Nexa Capital. The returns have been exactly as promised, and the customer service is exceptional whenever I have questions.",
    },
    {
      name: "Emma Rodriguez",
      role: "Financial Analyst",
      image: "/placeholder.svg?height=200&width=200",
      content:
        "I've been investing with Nexa Capital for over a year now, and I'm impressed with their consistent performance. The platform is secure, and the daily earnings have helped me achieve my financial goals faster than expected.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <section className="py-20">
      <div ref={sectionRef} className="container opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-primary">Investors</span> Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from our community of investors who have experienced success with our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg bg-card border p-8 md:p-12">
            <div className="mb-6 text-primary">
              <Quote className="h-10 w-10" />
            </div>

            <p className="text-lg md:text-xl mb-8">{testimonials[currentIndex].content}</p>

            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{testimonials[currentIndex].name}</h4>
                <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
