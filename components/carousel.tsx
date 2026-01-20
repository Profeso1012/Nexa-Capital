"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: ReactNode[]
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

export function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className,
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const childrenArray = Array.isArray(children) ? children : [children]
  const childCount = childrenArray.length

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (autoPlay) {
      timerRef.current = setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % childCount)
      }, interval)
    }
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [activeIndex, autoPlay, childCount, interval])

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    resetTimer()
  }

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + childCount) % childCount)
    resetTimer()
  }

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % childCount)
    resetTimer()
  }

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNextSlide()
    } else if (isRightSwipe) {
      goToPrevSlide()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn("carousel-container", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative min-h-[400px]">
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={cn(
              "carousel-item",
              index === activeIndex ? "active" : "inactive",
              "transition-all duration-300 ease-in-out",
            )}
            aria-hidden={index !== activeIndex}
          >
            {child}
          </div>
        ))}

        {showControls && childCount > 1 && !isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm hidden md:flex"
              onClick={goToPrevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm hidden md:flex"
              onClick={goToNextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {showIndicators && childCount > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: childCount }).map((_, index) => (
            <button
              key={index}
              className={cn("carousel-dot", index === activeIndex && "active")}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
