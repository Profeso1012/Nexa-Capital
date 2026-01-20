"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Linkedin, Twitter, Mail } from "lucide-react"

export function TeamMembers() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const memberRefs = useRef<(HTMLDivElement | null)[]>([])

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

    memberRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)

      memberRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const team = [
    {
      name: "Jonathan Wilson",
      role: "Chief Executive Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "With over 20 years of experience in financial markets, Jonathan leads our company with a vision for innovation and excellence.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "jonathan@nexacapital.com",
      },
    },
    {
      name: "Sarah Chen",
      role: "Chief Investment Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Sarah brings 15 years of investment strategy expertise, previously managing portfolios worth over $2 billion.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@nexacapital.com",
      },
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Technology",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Michael leads our technology initiatives, ensuring our platform remains secure, efficient, and user-friendly.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@nexacapital.com",
      },
    },
    {
      name: "Emily Johnson",
      role: "Chief Financial Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Emily oversees our financial operations, bringing a wealth of experience from her background in corporate finance.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@nexacapital.com",
      },
    },
    {
      name: "David Thompson",
      role: "Head of Customer Relations",
      image: "/placeholder.svg?height=400&width=400",
      bio: "David ensures our clients receive exceptional service and support throughout their investment journey.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@nexacapital.com",
      },
    },
    {
      name: "Olivia Martinez",
      role: "Compliance Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Olivia ensures our operations comply with all relevant regulations and industry standards.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "olivia@nexacapital.com",
      },
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-muted/30">
      <div className="container">
        <div
          ref={sectionRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our team of experienced professionals is dedicated to helping you achieve your financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              ref={(el) => (memberRefs.current[index] = el)}
              className="bg-white dark:bg-card rounded-lg border p-6 opacity-0 translate-y-8 transition-all duration-700 ease-out service-card-hover"
              style={{ transitionDelay: `${150 * (index % 3)}ms` }}
            >
              <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex space-x-3">
                <a
                  href={member.social.linkedin}
                  className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={member.social.twitter}
                  className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${member.social.email}`}
                  className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
