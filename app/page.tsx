import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TreeDeciduous, Axe, Layers, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    title: "Tree Removal",
    description: "Safe and efficient removal of unwanted or hazardous trees from your property.",
    icon: TreeDeciduous,
    href: "/services#tree-removal",
  },
  {
    title: "Tree Topping",
    description: "Professional tree topping to manage height and promote healthy growth.",
    icon: Axe,
    href: "/services#tree-topping",
  },
  {
    title: "Tree Chipping",
    description: "On-site chipping with mulch for your landscaping or full debris hauling — your choice.",
    icon: Layers,
    href: "/services#tree-chipping",
  },
  {
    title: "Stump Grinding",
    description: "Complete stump removal to reclaim your yard space.",
    icon: CircleDot,
    href: "/services#stump-grinding",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — full-screen Vimeo background video */}
      <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Vimeo background video */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/893861469?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Fallen Timber Bkgd"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "max(100%, 177.78vh)",
              height: "max(100%, 56.25vw)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center text-white">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance drop-shadow-lg">
            Your Premier Tree Service<br />in Warsaw, Indiana!
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-2xl mx-auto text-pretty drop-shadow">
            At Fallen Timber, our mission is to provide superior tree services.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Contact Us Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Our Services</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Expert Tree Services Tailored to Your Needs
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              At Fallen Timber, we understand the significance of well-maintained trees for the beauty and safety of your property. Our seasoned team is dedicated to providing top-notch tree services in Warsaw, IN. Whether you need tree removal, tree topping, tree chipping, or stump grinding, we&apos;ve got you covered.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  <Link
                    href={service.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden">
              <Image
                src="/fallen-timber/gallery/fallen-timber-2020.jpg"
                alt="Fallen Timber team at work"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary">About Us</p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Your Trusted Local Partner for Tree Services
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Fallen Timber is your trusted local partner for all tree-related needs. Our services are designed to cater to the specific requirements of Warsaw and its surrounding areas.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With years of experience and a commitment to safety and quality, our team delivers professional results every time. We take pride in our work and treat every property as if it were our own.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
            Ready to Transform Your Property?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90 leading-relaxed">
            Contact us today for a free estimate. We are here to help with all your tree service needs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10" asChild>
              <a href="tel:+15745512585">Call (574) 551-2585</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
