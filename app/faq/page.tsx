import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ | Nexa Capital Limited",
  description: "Find answers to frequently asked questions about Nexa Capital Limited and our investment platform.",
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Frequently Asked Questions"
          description="Find answers to common questions about our platform and investment services."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "FAQ", href: "/faq" },
          ]}
        />
        <div className="py-16 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">General Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What is Nexa Capital Limited?</AccordionTrigger>
                      <AccordionContent>
                        Nexa Capital Limited is a trusted wealth-building platform offering reliable daily earnings,
                        secure investment plans, and professional financial tools tailored for your long-term success.
                        We provide a range of investment opportunities designed to help individuals grow their wealth.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How long has Nexa Capital been operating?</AccordionTrigger>
                      <AccordionContent>
                        Nexa Capital Limited has been operating for over 5 years, providing reliable investment services
                        to clients worldwide. We have established a strong track record of consistent returns and
                        customer satisfaction.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Is Nexa Capital regulated?</AccordionTrigger>
                      <AccordionContent>
                        Yes, Nexa Capital Limited is a registered company in the United Kingdom (Company No. 12345678)
                        and operates in compliance with all applicable financial regulations. We adhere to strict
                        standards of transparency and accountability.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Account & Registration</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I create an account?</AccordionTrigger>
                      <AccordionContent>
                        To create an account, click on the "Register" button in the top right corner of our website.
                        Fill out the registration form with your personal information, verify your email address, and
                        complete the KYC verification process to start using our platform.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>What is KYC verification and why is it required?</AccordionTrigger>
                      <AccordionContent>
                        KYC (Know Your Customer) verification is a standard process in the financial industry to verify
                        the identity of clients. It helps prevent fraud, money laundering, and other illegal activities.
                        We require KYC verification to comply with regulatory requirements and to ensure the security of
                        our platform.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger>How long does the verification process take?</AccordionTrigger>
                      <AccordionContent>
                        The verification process typically takes 24-48 hours to complete. In some cases, it may take
                        longer if additional information is required. We strive to process all verification requests as
                        quickly as possible.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Investments & Returns</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-7">
                      <AccordionTrigger>What investment plans do you offer?</AccordionTrigger>
                      <AccordionContent>
                        We offer a range of investment plans to suit different financial goals and risk appetites. Our
                        plans include Starter Plan (Bronze), Beginner Investment (Silver), Growth Investment (Gold),
                        Growth Advanced (Platinum), Gold Investment (Diamond), Executive Investment (Sapphire), and
                        Business Expansion (Emerald). Each plan offers different daily returns and requires different
                        minimum investment amounts.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                      <AccordionTrigger>How are the daily returns calculated?</AccordionTrigger>
                      <AccordionContent>
                        Daily returns are calculated as a percentage of your investment amount based on the plan you
                        choose. For example, if you invest $1,000 in our Gold plan with a 2.0% daily rate, you'll earn
                        $20 per day. Returns are automatically added to your account balance.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                      <AccordionTrigger>Can I have multiple investments at the same time?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can have multiple investments across different plans simultaneously. This allows you to
                        diversify your investment portfolio and potentially increase your overall returns.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Deposits & Withdrawals</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-10">
                      <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                      <AccordionContent>
                        We accept various payment methods including bank transfers, credit/debit cards, and
                        cryptocurrencies such as Bitcoin and Ethereum. The available payment methods may vary depending
                        on your location.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-11">
                      <AccordionTrigger>How long do deposits take to process?</AccordionTrigger>
                      <AccordionContent>
                        Deposit processing times vary depending on the payment method. Cryptocurrency deposits are
                        typically credited within 3 network confirmations. Bank transfers may take 1-3 business days,
                        while credit/debit card payments are usually processed instantly.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-12">
                      <AccordionTrigger>How do I withdraw my funds?</AccordionTrigger>
                      <AccordionContent>
                        To withdraw funds, log in to your account, navigate to the Wallet section, and click on
                        "Withdraw." Select your preferred withdrawal method, enter the amount you wish to withdraw, and
                        follow the instructions. Withdrawal requests are processed within 24-48 hours.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-13">
                      <AccordionTrigger>Is there a minimum withdrawal amount?</AccordionTrigger>
                      <AccordionContent>
                        Yes, the minimum withdrawal amount is $50. This helps us maintain efficient processing of
                        withdrawal requests and minimize transaction fees.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Referral Program</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-14">
                      <AccordionTrigger>How does the referral program work?</AccordionTrigger>
                      <AccordionContent>
                        Our referral program allows you to earn a 5% bonus on the deposits made by users who register
                        using your referral link. There's no limit to how many people you can refer, so your earning
                        potential is unlimited.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-15">
                      <AccordionTrigger>Where can I find my referral link?</AccordionTrigger>
                      <AccordionContent>
                        You can find your referral link in the Referrals section of your dashboard. You can copy this
                        link and share it with friends, family, or on social media to start earning referral bonuses.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-16">
                      <AccordionTrigger>When do I receive my referral bonus?</AccordionTrigger>
                      <AccordionContent>
                        Referral bonuses are credited to your account immediately after your referred user makes a
                        deposit. You can view all your referral earnings in the Referrals section of your dashboard.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Security</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-17">
                      <AccordionTrigger>How secure is my investment?</AccordionTrigger>
                      <AccordionContent>
                        We implement enterprise-grade security measures to protect your investments. Our platform uses
                        advanced encryption, secure socket layer (SSL) technology, and follows strict security protocols
                        to ensure the safety of your funds and personal information.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-18">
                      <AccordionTrigger>How do you protect my personal information?</AccordionTrigger>
                      <AccordionContent>
                        We take data protection seriously and comply with all applicable privacy laws. Your personal
                        information is encrypted and stored securely. We do not share your information with third
                        parties without your consent, except as required by law.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-19">
                      <AccordionTrigger>
                        What should I do if I suspect unauthorized activity on my account?
                      </AccordionTrigger>
                      <AccordionContent>
                        If you suspect unauthorized activity on your account, immediately change your password and
                        contact our support team at support@nexacapital.com. We recommend enabling two-factor
                        authentication for an additional layer of security.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
