import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Terms of Service | Nexa Capital Limited",
  description: "Read our terms of service and understand the rules and guidelines for using our platform.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Terms of Service"
          description="Please read these terms carefully before using our platform."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Terms of Service", href: "/terms" },
          ]}
        />
        <div className="py-16 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Nexa Capital Limited platform, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use our platform.
              </p>

              <h2>2. Eligibility</h2>
              <p>
                You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use
                our services. By using our platform, you represent and warrant that you meet these requirements.
              </p>

              <h2>3. Account Registration</h2>
              <p>
                To access certain features of our platform, you must register for an account. You agree to provide
                accurate, current, and complete information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>

              <h2>4. Investment Risks</h2>
              <p>
                All investments involve risk, and the past performance of a security, industry, sector, market,
                financial product, trading strategy, or individual's trading does not guarantee future results or
                returns. Investors are fully responsible for any investment decisions they make. Such decisions should
                be based on an evaluation of their financial circumstances, investment objectives, risk tolerance, and
                liquidity needs.
              </p>

              <h2>5. Privacy Policy</h2>
              <p>
                Your use of our platform is also governed by our Privacy Policy, which is incorporated into these Terms
                of Service by reference.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our platform, including but not limited to text, graphics,
                logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive
                property of Nexa Capital Limited or its licensors and are protected by copyright, trademark, and other
                intellectual property laws.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                In no event shall Nexa Capital Limited, its affiliates, or their respective officers, directors,
                employees, or agents be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your access to or use of or inability to access or use the platform.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the United
                Kingdom, without regard to its conflict of law principles.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. If we make changes, we will provide
                notice of such changes, such as by sending an email notification, providing notice through our platform,
                or updating the "Last Updated" date at the beginning of these Terms of Service.
              </p>

              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@nexacapital.com">legal@nexacapital.com</a>.
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
