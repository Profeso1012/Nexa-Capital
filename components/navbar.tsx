"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, ChevronDown, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

export function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setIsLoggedIn(true)
      try {
        const userData = JSON.parse(user)
        setUsername(userData.username)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest(".mobile-nav-panel") && !target.closest("button")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUsername('')
    router.push('/')
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200",
          scrolled ? "bg-background/95 supports-[backdrop-filter]:bg-background/60" : "bg-background/50",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                  Investment Plans
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/plans" className="w-full">
                    View All Plans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/plans#starter" className="w-full">
                    Starter Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/plans#growth" className="w-full">
                    Growth Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/plans#premium" className="w-full">
                    Premium Plan
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground">Hi, {username}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center gap-4">
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Menu Button for scrolled pages */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        {!isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Mobile Navigation Panel - Fixed to viewport */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? "open" : "closed"}`} onClick={() => setIsMenuOpen(false)} />
      <div
        className={`mobile-nav-panel ${isMenuOpen ? "open" : "closed"}`}
        style={{ position: "fixed", top: 0, height: "100vh" }}
      >
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <Logo />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 space-y-4 flex flex-col h-[calc(100vh-64px)] bg-background overflow-y-auto">
          <div className="flex-1 space-y-4">
            {isLoggedIn && (
              <div className="pb-2 border-b">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium">{username}</p>
              </div>
            )}
            <Link
              href="/"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div className="py-2">
              <div className="text-base font-medium mb-2">Investment Plans</div>
              <div className="pl-4 space-y-2 border-l border-border">
                <Link
                  href="/plans"
                  className="block py-1 text-sm hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Plans
                </Link>
                <Link
                  href="/plans#starter"
                  className="block py-1 text-sm hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Starter Plan
                </Link>
                <Link
                  href="/plans#growth"
                  className="block py-1 text-sm hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Growth Plan
                </Link>
                <Link
                  href="/plans#premium"
                  className="block py-1 text-sm hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Premium Plan
                </Link>
              </div>
            </div>
            <Link
              href="/about"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/how-it-works"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="border-t pt-4 flex justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Button>
                </Link>
                <Button size="icon" className="h-10 w-10" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="icon" className="h-10 w-10">
                    <UserPlus className="h-5 w-5" />
                    <span className="sr-only">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
