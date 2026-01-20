"use client"

import { useEffect, useRef } from "react"
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactInfo() {
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          infoRef.current?.classList.add("animate-in")
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (infoRef.current) observer.observe(infoRef.current)

    return () => {
      if (infoRef.current) observer.unobserve(infoRef.current)
    }
  }, [])

  return (
    <div ref={infoRef} className="opacity-0 translate-y-8 transition-all duration-700 ease-out space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="text-muted-foreground mb-8">
          Have questions about our investment plans or need assistance with your account? Our team is here to help.
          Reach out to us using any of the contact methods below.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Our Location</h3>
            <p className="text-muted-foreground">123 Financial District, London, UK</p>
            <Button variant="link" className="p-0 h-auto mt-1" asChild>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                View on Map <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Phone Number</h3>
            <p className="text-muted-foreground">+44 123 456 7890</p>
            <p className="text-sm text-muted-foreground">Monday to Friday, 9am to 6pm GMT</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Email Address</h3>
            <p className="text-muted-foreground">info@nexacapital.com</p>
            <p className="text-sm text-muted-foreground">We aim to respond within 24 hours</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Business Hours</h3>
            <p className="text-muted-foreground">Monday to Friday: 9am - 6pm GMT</p>
            <p className="text-muted-foreground">Saturday: 10am - 2pm GMT</p>
            <p className="text-muted-foreground">Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="font-medium mb-3">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors" aria-label="Facebook">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors" aria-label="Twitter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors" aria-label="LinkedIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
