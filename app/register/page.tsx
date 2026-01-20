"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    countryCode: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referredBy: '',
    agreeToTerms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.countryCode) newErrors.countryCode = "Country code is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms"
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive"
      })
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // REAL API CALL TO MONGODB
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          countryCode: formData.countryCode,
          phone: formData.phone,
          referredBy: formData.referredBy || undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        toast({
          title: "Registration successful!",
          description: `Welcome to Nexa Capital, ${data.user.username}!`,
        })

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // Set field-specific errors
        if (data.error.includes('email')) {
          setErrors({ email: data.error })
        } else if (data.error.includes('username')) {
          setErrors({ username: data.error })
        } else {
          setErrors({ general: data.error })
        }
        
        toast({
          title: "Registration failed",
          description: data.error || "An error occurred during registration",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: "Connection error. Please try again." })
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with background image and text */}
      <div className="relative hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 bg-background dark:bg-[#0f172a] p-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-foreground">Create New Account</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join Nexa Capital and start your investment journey today.
          </p>
          <Link href="/login">
            <Button variant="outline" className="border-muted-foreground/20 hover:bg-muted/10">
              Back to Login
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-0">
          <Image
            src="/images/register-new-bg.png"
            alt="Registration background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
          />
        </div>
      </div>

      {/* Right side with form - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center bg-background dark:bg-[#0f172a]">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">Register</h2>
          <p className="text-muted-foreground mb-8">Create your account to start investing</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                className={`bg-background dark:bg-[#1e293b] border-input dark:border-[#334155] ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.username && <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`bg-background dark:bg-[#1e293b] border-input dark:border-[#334155] ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`flex h-10 w-full rounded-md border bg-background dark:bg-[#1e293b] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.country ? 'border-red-500 focus-visible:ring-red-500' : 'border-input dark:border-[#334155]'}`}
                >
                  <option value="">Select</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="South Africa">South Africa</option>
                  <option value="India">India</option>
                </select>
                {errors.country && <p className="text-sm text-red-600 dark:text-red-400">{errors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className={`flex h-10 w-full rounded-md border bg-background dark:bg-[#1e293b] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.countryCode ? 'border-red-500 focus-visible:ring-red-500' : 'border-input dark:border-[#334155]'}`}
                >
                  <option value="">Select code</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+49">+49 (DE)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+234">+234 (NG)</option>
                  <option value="+27">+27 (ZA)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                {errors.countryCode && <p className="text-sm text-red-600 dark:text-red-400">{errors.countryCode}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`bg-background dark:bg-[#1e293b] border-input dark:border-[#334155] ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.phone && <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referredBy">Referral Code (Optional)</Label>
              <Input
                id="referredBy"
                name="referredBy"
                placeholder="Enter referral code"
                value={formData.referredBy}
                onChange={handleChange}
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`bg-background dark:bg-[#1e293b] border-input dark:border-[#334155] ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`bg-background dark:bg-[#1e293b] border-input dark:border-[#334155] ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                className={`mt-1 data-[state=checked]:bg-primary border-input dark:border-[#334155] ${errors.agreeToTerms ? 'border-red-500' : ''}`}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree with{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Company Policy
                </Link>
                ,{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                ,{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login Now
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile view */}
      <div className="relative w-full flex items-center justify-center lg:hidden min-h-screen">
        <Image src="/images/register-new-bg.png" alt="Registration background" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-md mx-4 my-8 bg-background/95 dark:bg-[#0f172a]/95 p-6 rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-4">
              <Image src="/images/logo.png" alt="Nexa Capital Logo" width={150} height={40} />
            </Link>
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="mobile-username">Username</Label>
              <Input
                id="mobile-username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile-email">Email address</Label>
              <Input
                id="mobile-email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="mobile-country">Country</Label>
                <select
                  id="mobile-country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input dark:border-[#334155] bg-background dark:bg-[#1e293b] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="mobile-countryCode">Country Code</Label>
                <select
                  id="mobile-countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input dark:border-[#334155] bg-background dark:bg-[#1e293b] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Code</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile-phone">Phone number</Label>
              <Input
                id="mobile-phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile-referredBy">Referral Code (Optional)</Label>
              <Input
                id="mobile-referredBy"
                name="referredBy"
                placeholder="Enter referral code"
                value={formData.referredBy}
                onChange={handleChange}
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile-password">Password</Label>
              <Input
                id="mobile-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile-confirmPassword">Confirm Password</Label>
              <Input
                id="mobile-confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-background dark:bg-[#1e293b] border-input dark:border-[#334155]"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="mobile-terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                className="mt-1 data-[state=checked]:bg-primary border-input dark:border-[#334155]"
              />
              <Label htmlFor="mobile-terms" className="text-sm font-normal">
                I agree with{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Policies
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
