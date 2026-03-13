"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

const services = [
  { value: "tree-removal", label: "Tree Removal" },
  { value: "tree-topping", label: "Tree Topping" },
  { value: "tree-chipping", label: "Tree Chipping" },
  { value: "stump-grinding", label: "Stump Grinding" },
  { value: "other", label: "Other / Not Sure" },
]

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      service: selectedService,
      desiredDate: (form.elements.namedItem("desiredDate") as HTMLInputElement).value,
      desiredTime: (form.elements.namedItem("desiredTime") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      details: (form.elements.namedItem("details") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        alert("Something went wrong. Please try again or call us directly.")
      }
    } catch {
      alert("Something went wrong. Please try again or call us directly.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
          Thank You!
        </h3>
        <p className="mt-2 text-muted-foreground">
          We have received your message and will get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Your Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="John Doe"
        />
      </div>

      {/* Your Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Your Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="(xxx) xxx-xxxx"
        />
      </div>

      {/* Your Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Your Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
        />
      </div>

      {/* Select Service */}
      <div className="space-y-2">
        <Label htmlFor="service">Select Service</Label>
        <Select name="service" required onValueChange={setSelectedService}>
          <SelectTrigger id="service">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desired Date & Time */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="desiredDate">Desired Date</Label>
          <Input
            id="desiredDate"
            name="desiredDate"
            type="date"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desiredTime">Desired Time</Label>
          <Input
            id="desiredTime"
            name="desiredTime"
            type="time"
            required
          />
        </div>
      </div>

      {/* Location Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Location Address</Label>
        <Input
          id="address"
          name="address"
          required
          placeholder="123 Main St, Warsaw, IN 46580"
        />
      </div>

      {/* Details about your request */}
      <div className="space-y-2">
        <Label htmlFor="details">Details about your request</Label>
        <Textarea
          id="details"
          name="details"
          required
          placeholder="Tell us about your project, any specific requirements, or questions you have..."
          rows={5}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Submit Request"}
      </Button>
    </form>
  )
}
