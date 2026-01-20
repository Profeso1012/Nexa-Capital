import Image from "next/image"
import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image src="/images/logo.png" alt="Nexa Capital Limited" width={40} height={40} />
      <span className="text-xl font-bold">Nexa Capital</span>
    </Link>
  )
}
