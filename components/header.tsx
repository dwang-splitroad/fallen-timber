"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isTransparent = (isHome || pathname === "/about" || pathname === "/services") && !scrolled

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-primary shadow-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            {/* Full logo on sm+, icon-only crop on mobile */}
            <Image
              src="/fallen-timber/logo/Fallen-Timber-Logo.png"
              alt="Fallen Timber"
              width={200}
              height={60}
              className="hidden sm:block h-11 w-auto object-contain"
              priority
            />
            <Image
              src="/fallen-timber/logo/Fallen-Timber-white.png"
              alt="Fallen Timber"
              width={40}
              height={40}
              className="block sm:hidden h-9 w-9 object-contain"
              priority
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Phone CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <a
            href="tel:+15745512585"
            className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>(574) 551-2585</span>
          </a>
          <Button className="bg-black text-white hover:bg-black/80" asChild>
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-primary-foreground/20 bg-primary">
          <div className="space-y-1 px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-primary-foreground/20 mt-4">
              <a
                href="tel:+15745512585"
                className="flex items-center gap-2 py-2 text-base font-medium text-primary-foreground/80"
              >
                <Phone className="h-5 w-5" />
                <span>(574) 551-2585</span>
              </a>
              <Button className="w-full mt-3 bg-black text-white hover:bg-black/80" asChild>
                <Link href="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
