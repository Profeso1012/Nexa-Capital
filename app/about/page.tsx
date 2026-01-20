import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CallToAction } from "@/components/call-to-action"
import { Stats } from "@/components/stats"
import { PageHeader } from "@/components/page-header"
import { TeamMembers } from "@/components/team-members"
import { CompanyTimeline } from "@/components/company-timeline"
import { OurMission } from "@/components/our-mission"

export const metadata = {
  title: "About Us | Nexa Capital Limited",
  description: "Learn about Nexa Capital Limited, our mission, values, and the team behind our success.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="About Us"
          description="Learn about our company, our mission, and the team behind our success."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
          ]}
        />
        <OurMission />
        <Stats />
        <CompanyTimeline />
        <TeamMembers />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
