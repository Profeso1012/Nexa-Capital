import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Privacy Policy | Nexa Capital Limited",
  description: "Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Privacy Policy"
          description="Learn how we collect, use, and protect your personal information."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/privacy" },
          ]}
        />
        <div className="py-16 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2>1. Introduction</h2>
              <p>
                At Nexa Capital Limited, we respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you about how we look after your personal data when you visit our
                website and tell you about your privacy rights and how the law protects you.
              </p>

              <h2>2. The Data We Collect About You</h2>
              <p>
                Personal data, or personal information, means any information about an individual from which that person
                can be identified. We may collect, use, store, and transfer different kinds of personal data about you,
                including:
              </p>
              <ul>
                <li>Identity Data: includes first name, last name, username, title, date of birth</li>
                <li>Contact Data: includes billing address, email address, telephone numbers</li>
                <li>Financial Data: includes bank account details, payment card details</li>
                <li>Transaction Data: includes details about payments to and from you</li>
                <li>Technical Data: includes IP address, login data, browser type and version</li>
                <li>Profile Data: includes your username and password, investments made by you</li>
                <li>Usage Data: includes information about how you use our website and services</li>
                <li>Marketing and Communications Data: includes your preferences in receiving marketing from us</li>
              </ul>

              <h2>3. How We Use Your Personal Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
                <li>
                  Where it is necessary for our legitimate interests and your interests and fundamental rights do not
                  override those interests
                </li>
                <li>Where we need to comply with a legal or regulatory obligation</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally
                lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
                your personal data to those employees, agents, contractors, and other third parties who have a business
                need to know.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it
                for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>

              <h2>6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul>
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>

              <h2>7. Changes to the Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new
                privacy policy on this page and updating the "Last Updated" date.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact our Data
                Protection Officer at <a href="mailto:privacy@nexacapital.com">privacy@nexacapital.com</a>.
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
