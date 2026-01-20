import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CallToAction } from "@/components/call-to-action"
import { HowItWorks } from "@/components/how-it-works"
import { PageHeader } from "@/components/page-header"
import { InvestmentProcess } from "@/components/investment-process"

export const metadata = {
  title: "How It Works | Nexa Capital Limited",
  description: "Learn how Nexa Capital's investment platform works and how to get started.",
}

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="How It Works"
          description="Learn how our investment platform works and how to get started."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "How It Works", href: "/how-it-works" },
          ]}
        />
        <HowItWorks />
        <InvestmentProcess />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
