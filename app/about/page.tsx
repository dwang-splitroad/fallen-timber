import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Fallen Timber - your trusted local partner for all tree-related needs in Warsaw, Indiana.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero — full-screen wood background */}
      <section className="relative h-[100dvh] min-h-[600px] -mt-[72px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/fallen-timber/wood-background-1-scaled-e1700515191660.jpg"
            alt="Wood grain background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-4">
            Warsaw, Indiana
          </p>
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance drop-shadow-lg">
            Proudly Serving Warsaw, Indiana
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-2xl mx-auto text-pretty drop-shadow">
            Fallen Timber is your trusted local partner for all tree-related needs. Our services are designed to cater to the specific requirements of Warsaw and its surrounding areas.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/fallen-timber/gallery/DJI_0033-scaled.jpg"
                alt="Fallen Timber crane working in the trees"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Who We Are</p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Our Mission is to Provide Superior Tree Services.
              </h2>
              <p className="mt-4 text-lg font-medium text-foreground">
                Proudly Serving Warsaw, Indiana
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Fallen Timber is your trusted local partner for all tree-related needs. Our services are designed to cater to the specific requirements of Warsaw and its surrounding areas.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Let Fallen Timber be your go-to tree service provider — where expertise meets excellence in Warsaw, Indiana!
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Contact Us Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State of the Art Equipment */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
                Our Equipment
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
                State of the Art Equipment
              </h2>
              <p className="mt-6 text-primary-foreground/90 leading-relaxed">
                We use a highly compact <span className="font-semibold text-primary-foreground">(34.5″ wide) Crawler 78 boom lift</span> which rises to heights of 78 ft. and reaches horizontally up to 45 ft. It fits through any standard gate and is on tracks to avoid bucket truck ruts in your lawn.
              </p>
              <p className="mt-4 text-primary-foreground/90 leading-relaxed">
                Also in our arsenal is a <span className="font-semibold text-primary-foreground">Big Shot Launcher</span> which allows us to precisely set rope lines for quickly and efficiently dropping trees of any size where space permits. This ensures we pull the tree away from your valuable structures at a fraction of the cost of other methods.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  asChild
                >
                  <Link href="/contact">
                    Request a Quote Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image — first on mobile, left on desktop */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg order-first lg:order-first">
              <Image
                src="/fallen-timber/gallery/fallen-timber-3.jpg"
                alt="Fallen Timber equipment in action"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
