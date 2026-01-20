import { Database, FileText, CreditCard, Wallet } from "lucide-react"

export function ServiceCards() {
  const services = [
    {
      title: "Tax Filing & Returns",
      description:
        "Stay compliant with our expert tax filing services. We simplify the process of tax returns and filings, ensuring accuracy and efficiency while maximizing your eligible deductions.",
      icon: FileText,
    },
    {
      title: "Grants & Financial Aid",
      description:
        "We help individuals and businesses access funding opportunities through grants and financial aid programs designed to support growth and innovation.",
      icon: Database,
    },
    {
      title: "Loan Offers",
      description:
        "Unlock opportunities with our flexible loan solutions, including personal loans, business loans, mortgage financing, and more. Our competitive rates and transparent terms make borrowing simple and stress-free.",
      icon: CreditCard,
    },
    {
      title: "Deposit Schemes",
      description:
        "Grow your wealth with our secure and high-yield savings and investment deposit plans. Whether you're saving for the future or looking for structured investment options, we have solutions that fit your financial goals.",
      icon: Wallet,
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Comprehensive financial solutions tailored to your needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card hover:bg-primary/10 dark:hover:bg-primary/10 border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
