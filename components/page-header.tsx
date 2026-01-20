"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useEffect, useRef } from "react"

interface Breadcrumb {
  label: string
  href: string
}

interface PageHeaderProps {
  title: string
  description: string
  breadcrumbs?: Breadcrumb[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          headerRef.current?.classList.add("animate-in")
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (headerRef.current) observer.observe(headerRef.current)

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current)
    }
  }, [])

  return (
    <div className="bg-muted/30 py-12 md:py-16">
      <div className="container">
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          {breadcrumbs && (
            <div className="flex justify-center items-center space-x-2 mb-6 text-sm text-muted-foreground">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                  <Link href={breadcrumb.href} className="hover:text-primary transition-colors">
                    {breadcrumb.label}
                  </Link>
                </div>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
