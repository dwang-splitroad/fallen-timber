import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TreeDeciduous, Axe, Layers, CircleDot, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Services",
  description: "Professional tree removal, tree topping, tree trimming, and stump grinding services in Warsaw, Indiana.",
}

const services = [
  {
    id: "tree-removal",
    title: "Tree Removal",
    description: "Safe and efficient removal of unwanted or hazardous trees from your property. Our experienced team uses professional equipment and techniques to ensure safe removal while protecting your property.",
    icon: TreeDeciduous,
    features: [
      "Hazardous tree assessment",
      "Safe removal techniques",
      "Property protection measures",
      "Complete debris cleanup",
      "Emergency services available",
    ],
  },
  {
    id: "tree-topping",
    title: "Tree Topping",
    description: "Professional tree topping services to manage tree height and promote healthy growth. We carefully assess each tree to determine the best approach for long-term health and aesthetics.",
    icon: Axe,
    features: [
      "Height management",
      "Crown reduction",
      "Storm damage prevention",
      "Improved tree health",
      "Enhanced property views",
    ],
  },
  {
    id: "tree-trimming",
    title: "Tree Trimming",
    description: "Keep your trees healthy, safe, and looking their best with our professional trimming services. Proper pruning promotes growth, removes hazards, and enhances your property's appearance.",
    icon: Layers,
    features: [
      "Crown shaping and thinning",
      "Dead branch removal",
      "Improved tree health",
      "Enhanced property aesthetics",
      "Storm damage prevention",
    ],
  },
  {
    id: "stump-grinding",
    title: "Stump Grinding",
    description: "Complete stump removal to reclaim your yard space and eliminate trip hazards. Our powerful equipment grinds stumps below ground level for a clean finish.",
    icon: CircleDot,
    features: [
      "Below-ground grinding",
      "Complete root removal",
      "Yard space restoration",
      "Trip hazard elimination",
      "Lawn-ready finish",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero — full-screen background */}
      <section className="relative h-screen -mt-[72px] flex items-center justify-center overflow-hidden">
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
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance drop-shadow-lg">
            Our Services
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-2xl mx-auto text-pretty drop-shadow">
            Expert tree services tailored to your needs. At Fallen Timber, we understand the significance of well-maintained trees for the beauty and safety of your property.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} id={service.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 font-serif text-2xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button asChild>
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
            Not sure which service you need? Contact us for a free consultation and we will help you determine the best solution for your property.
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
