import dynamic from 'next/dynamic'
import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Lazy load components that are below the fold
const Stats = dynamic(() => import("@/components/stats").then(mod => ({ default: mod.Stats })), {
  loading: () => <div className="h-32 animate-pulse bg-muted" />
})
const ServiceCards = dynamic(() => import("@/components/service-cards").then(mod => ({ default: mod.ServiceCards })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const InvestmentPlans = dynamic(() => import("@/components/investment-plans").then(mod => ({ default: mod.InvestmentPlans })), {
  loading: () => <div className="h-96 animate-pulse bg-muted" />
})
const HowItWorks = dynamic(() => import("@/components/how-it-works").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const Features = dynamic(() => import("@/components/features").then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const RecentActivities = dynamic(() => import("@/components/recent-activities").then(mod => ({ default: mod.RecentActivities })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const WhyChooseUs = dynamic(() => import("@/components/why-choose-us").then(mod => ({ default: mod.WhyChooseUs })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />
})
const CallToAction = dynamic(() => import("@/components/call-to-action").then(mod => ({ default: mod.CallToAction })), {
  loading: () => <div className="h-48 animate-pulse bg-muted" />
})

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Stats />
        <ServiceCards />
        <InvestmentPlans />
        <HowItWorks />
        <Features />
        <RecentActivities />
        <WhyChooseUs />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
