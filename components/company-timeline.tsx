"use client"

import { useEffect, useRef } from "react"

export function CompanyTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([])

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

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      timelineRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const timeline = [
    {
      year: "2018",
      title: "Company Founded",
      description:
        "Nexa Capital Limited was founded with a vision to provide accessible investment opportunities to individuals worldwide.",
    },
    {
      year: "2019",
      title: "Launch of First Investment Plans",
      description: "We introduced our first set of investment plans, offering daily returns to our early investors.",
    },
    {
      year: "2020",
      title: "Expansion of Services",
      description: "We expanded our services to include more investment options and introduced our referral program.",
    },
    {
      year: "2021",
      title: "Technology Upgrade",
      description: "We upgraded our platform with advanced security features and a more user-friendly interface.",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "We expanded our operations to serve clients in over 50 countries, becoming a truly global investment platform.",
    },
    {
      year: "2023",
      title: "Introduction of Premium Plans",
      description: "We introduced our premium investment plans, offering higher returns for serious investors.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From our founding to the present day, we've been committed to helping our clients build wealth.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border"></div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div
                key={index}
                ref={(el) => (timelineRefs.current[index] = el)}
                className={`relative flex flex-col md:flex-row gap-8 opacity-0 translate-y-8 transition-all duration-700 ease-out ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
                style={{ transitionDelay: `${150 * index}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 ml-12 md:ml-0 p-6 bg-white dark:bg-card rounded-lg border service-card-hover">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium mb-3">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
