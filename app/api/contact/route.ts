import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, service, desiredDate, desiredTime, address, details } = body

    const serviceLabel: Record<string, string> = {
      "tree-removal": "Tree Removal",
      "tree-topping": "Tree Topping",
      "tree-chipping": "Tree Chipping",
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
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${serviceLabel[service] ?? service}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Desired Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${desiredDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Desired Time</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${desiredTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Location</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Details</td>
            <td style="padding: 10px 0; line-height: 1.6;">${details?.replace(/\n/g, "<br>") ?? "—"}</td>
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
