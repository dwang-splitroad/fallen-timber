import type { Metadata } from "next"
import { Phone, Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Fallen Timber for tree removal, tree topping, tree trimming, and stump grinding services in Warsaw, Indiana.",
}

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "(574) 551-2585",
    href: "tel:+15745512585",
  },
  {
    icon: Mail,
    title: "Email",
    content: "clayton@fallen-timber.com",
    href: "mailto:clayton@fallen-timber.com",
  },
  {
    icon: MapPin,
    title: "Location",
    content: "4964 W. Lakeview Park Dr., Warsaw, IN 46580",
    href: "https://maps.google.com/?q=4964+W.+Lakeview+Park+Dr.,+Warsaw,+IN+46580",
  },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Send Us a Message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and we will get back to you as soon as possible.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 lg:pt-14">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                  Get in Touch
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Reach out to us directly using the information below.
                </p>
                <div className="mt-6 space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.content}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            Our Location
          </h2>
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-lg overflow-hidden bg-card border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.123456789!2d-85.8839!3d41.2378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE0JzE2LjAiTiA4NcKwNTMnMDIuMCJX!5e0!3m2!1sen!2sus!4v1699999999999&q=4964+W+Lakeview+Park+Dr,+Warsaw,+IN+46580"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fallen Timber Location - 4964 W. Lakeview Park Dr., Warsaw, IN 46580"
              className="absolute inset-0"
            />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            4964 W. Lakeview Park Dr., Warsaw, IN 46580
          </p>
        </div>
      </section>
    </div>
  )
}
