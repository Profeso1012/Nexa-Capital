import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Disclaimer | Nexa Capital Limited",
  description: "Important disclaimers regarding the use of our platform and investment information.",
}

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Disclaimer"
          description="Important information regarding the use of our platform and investment information."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Disclaimer", href: "/disclaimer" },
          ]}
        />
        <div className="py-16 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2>Investment Disclaimer</h2>
              <p>
                The information provided on this website is for general informational purposes only and should not be
                considered as financial advice. Investing involves risk, including the possible loss of principal. Past
                performance is not indicative of future results.
              </p>

              <h2>No Guarantee of Returns</h2>
              <p>
                While we strive to provide accurate information about potential investment returns, we cannot guarantee
                specific results. The performance of investments can fluctuate, and investments may lose value. The
                investment returns shown on our platform are based on historical data and projections, which may not
                accurately predict future performance.
              </p>

              <h2>Not Financial Advice</h2>
              <p>
                The content on this website should not be construed as financial advice. We recommend consulting with a
                qualified financial advisor before making any investment decisions. Your financial situation is unique,
                and the information provided may not be appropriate for your specific circumstances.
              </p>

              <h2>Third-Party Information</h2>
              <p>
                Our platform may include information from third-party sources that we believe to be reliable, but we do
                not guarantee the accuracy or completeness of this information. We are not responsible for any errors or
                omissions in the information provided by third parties.
              </p>

              <h2>Website Availability</h2>
              <p>
                We strive to ensure that our website is available at all times, but we do not guarantee uninterrupted
                access to our platform. Technical issues, maintenance, or other factors may temporarily affect the
                availability of our services.
              </p>

              <h2>Regulatory Compliance</h2>
              <p>
                Nexa Capital Limited operates in compliance with applicable laws and regulations. However, regulatory
                requirements can vary by jurisdiction, and our services may not be available or suitable for all
                individuals or entities in all locations.
              </p>

              <h2>Changes to Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon
                posting on our website. Your continued use of our platform after any changes indicates your acceptance
                of the updated disclaimer.
              </p>

              <p className="text-sm text-muted-foreground mt-8">Last Updated: April 28, 2023</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
