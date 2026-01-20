import { InvestmentPlans } from "@/components/investment-plans"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CallToAction } from "@/components/call-to-action"
import { Stats } from "@/components/stats"
import { Testimonials } from "@/components/testimonials"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Investment Plans | Nexa Capital Limited",
  description: "Explore our range of investment plans designed to help you grow your wealth.",
}

export default function PlansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Investment Plans"
          description="Choose the investment plan that best suits your financial goals and start earning daily returns."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Investment Plans", href: "/plans" },
          ]}
        />
        <Stats />
        <InvestmentPlans showAll={true} />
        <section className="py-16 bg-white dark:bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions About Our Investment Plans</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">How do I start investing with Nexa Capital?</h3>
                  <p className="text-muted-foreground">
                    To start investing, simply create an account, verify your email, complete the KYC process, and
                    deposit funds. Then, choose an investment plan that suits your financial goals and start earning
                    daily returns.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">What is the minimum investment amount?</h3>
                  <p className="text-muted-foreground">
                    Our investment plans start from as low as $50 for our Starter Plan, making it accessible for
                    beginners to start their investment journey.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">How are the daily returns calculated?</h3>
                  <p className="text-muted-foreground">
                    Daily returns are calculated as a percentage of your investment amount based on the plan you choose.
                    For example, if you invest $1,000 in our Gold plan with a 2.0% daily rate, you'll earn $20 per day.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">When can I withdraw my earnings?</h3>
                  <p className="text-muted-foreground">
                    You can withdraw your earnings at any time. Withdrawal requests are processed within 24-48 hours,
                    depending on the payment method you choose.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Is my investment secure?</h3>
                  <p className="text-muted-foreground">
                    Yes, we implement enterprise-grade security measures to protect your investments. Our platform uses
                    advanced encryption and follows strict security protocols to ensure the safety of your funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
