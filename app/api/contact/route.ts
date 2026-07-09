import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// --- Spam prevention config ---
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5 // max submissions per IP per window
const MIN_FILL_MS = 3_000 // reject if form filled in under 3s (bot)
const MAX_FIELD_LEN = 5_000

// In-memory rate limiter. Persists per server instance; a lightweight backstop,
// not a substitute for Turnstile.
const ipHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  ipHits.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again shortly." },
        { status: 429 },
      )
    }

    const body = await req.json()
    const {
      name,
      phone,
      email,
      service,
      desiredDate,
      desiredTime,
      address,
      details,
      website, // honeypot — must stay empty
      elapsedMs, // ms between form render and submit
    } = body

    // 1. Honeypot: bots fill hidden fields. Pretend success so they don't retry.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true })
    }

    // 2. Timing: humans can't fill this form in under a few seconds.
    if (!Number.isFinite(Number(elapsedMs)) || Number(elapsedMs) < MIN_FILL_MS) {
      return NextResponse.json({ success: true })
    }

    // 3. Basic validation
    const required = { name, phone, email, service, desiredDate, desiredTime, address, details }
    for (const [key, val] of Object.entries(required)) {
      if (typeof val !== "string" || val.trim() === "" || val.length > MAX_FIELD_LEN) {
        return NextResponse.json(
          { success: false, error: `Invalid field: ${key}` },
          { status: 400 },
        )
      }
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 },
      )
    }

    const serviceLabel: Record<string, string> = {
      "tree-removal": "Tree Removal",
      "tree-topping": "Tree Topping",
      "tree-trimming": "Tree Trimming",
      "stump-grinding": "Stump Grinding",
      "other": "Other / Not Sure",
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
        <h2 style="margin: 0 0 24px 0; font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 12px;">
          New Quote Request — Fallen Timber
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; width: 35%; font-weight: bold; vertical-align: top;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(serviceLabel[service] ?? service)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Desired Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(desiredDate)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Desired Time</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(desiredTime)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Location</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${escapeHtml(address)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Details</td>
            <td style="padding: 10px 0; line-height: 1.6;">${escapeHtml(details).replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
        <p style="margin-top: 32px; font-size: 12px; color: #666;">
          Sent from the Fallen Timber website contact form
        </p>
      </div>
    `

    await sgMail.send({
      to: { name: "Clayton Folk", email: "clayton@fallen-timber.com" },
      cc: { name: "Alex Miller", email: "alex@fallen-timber.com" },
      bcc: { name: "Dennis Wang", email: "dennis@splitroadmedia.com" },
      from: { name: "Fallen Timber Specialists", email: "website@fallen-timber.com" },
      replyTo: { name, email },
      subject: `New Quote Request from ${name}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("SendGrid error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 })
  }
}
