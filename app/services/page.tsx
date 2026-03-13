import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TreeDeciduous, Axe, Leaf, CircleDot, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Services",
  description: "Professional tree removal, tree topping, tree chipping, and stump grinding services in Warsaw, Indiana.",
}

const services = [
  {
    id: "tree-removal",
    title: "Tree Removal",
    subtitle: "Tailored Solutions for Every Tree",
    description: "From small pine trees to towering hardwoods, no tree is too challenging for our expert team. Utilizing our highly versatile lift, we can reach even the most difficult locations without the need for a costly and hazardous tree climber. Whether trees loom over your house, shed, pool, or intertwine with other trees, we have the expertise to navigate these situations safely and efficiently.",
    icon: TreeDeciduous,
    image: "/fallen-timber/gallery/fallen-timber-3.jpg",
    features: [
      "Small to large tree removal",
      "No tree climber required",
      "Roof, shed & pool clearance",
      "Complex & intertwined trees",
      "Safe, efficient techniques",
    ],
  },
  {
    id: "tree-topping",
    title: "Tree Topping",
    subtitle: "Shaping Trees to Perfection",
    description: "Our specialized lift excels in reaching tree tops, allowing us to shape trees according to your preferences. This is an excellent way to control overgrown trees, preventing them from encroaching on your roof, invading your pool, or causing other unwanted disruptions. Trust Fallen Timber for precision in tree topping to keep your landscape in check.",
    icon: Axe,
    image: "/fallen-timber/gallery/DJI_0033-scaled.jpg",
    features: [
      "Precision crown shaping",
      "Overgrowth control",
      "Roof & pool clearance",
      "Landscape improvement",
      "Lift access to any height",
    ],
  },
  {
    id: "tree-chipping",
    title: "Tree Chipping",
    subtitle: "Mulch or Removal, Your Choice",
    description: "After tree topping or removal, the resulting brush can be overwhelming. We offer on-site chipping, providing you with the option of mulch for your landscaping needs. Alternatively, we can efficiently haul away all debris, leaving your property clean and free from tree remnants.",
    icon: Leaf,
    image: "/fallen-timber/gallery/fallen-timber-27.jpg",
    features: [
      "On-site brush chipping",
      "Fresh mulch for landscaping",
      "Full debris hauling",
      "Clean property finish",
      "Available after any service",
    ],
  },
  {
    id: "stump-grinding",
    title: "Stump Grinding",
    subtitle: "Swift Removal of Stumps and Roots",
    description: "Don't wait decades for a tree stump to naturally decompose. Our stump grinding services ensure swift removal, leaving your yard free from unsightly stumps and pesky roots. Count on Fallen Timber to handle this with ease, restoring your outdoor space to its full potential.",
    icon: CircleDot,
    image: "/fallen-timber/gallery/fallen-timber-2020.jpg",
    features: [
      "Swift stump removal",
      "Root elimination",
      "Yard space restoration",
      "No more eyesores",
      "Full outdoor potential restored",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero — full-screen background */}
      <section className="relative h-[100dvh] min-h-[600px] -mt-[72px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/fallen-timber/fallen-timber-background.JPG"
            alt="Fallen Timber crew working on a tree"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl text-balance drop-shadow-lg">
            Comprehensive Tree Services in Warsaw and Beyond
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-2xl mx-auto text-pretty drop-shadow">
            At Fallen Timber, we stand as the premier provider of tree services in Warsaw and its surrounding areas. Our commitment to excellence is rooted in our state-of-the-art equipment and extensive knowledge, ensuring that we are well-equipped for any tree job imaginable.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Services Grid — 4×1 on desktop */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.id} id={service.id} className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col rounded-t-none pt-0 gap-0">
                {/* Photo */}
                <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-none">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 font-serif text-xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary italic">
                    {service.subtitle}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full" asChild>
                      <Link href="/contact">
                        Get a Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Need Help Deciding?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Not sure which service you need? Contact us for a free consultation and we will help you determine the best solution for your property. Tree removal, topping, chipping, or stump grinding — we have you covered.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+15745551234">Call (574) 555-1234</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
