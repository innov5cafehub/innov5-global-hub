import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 160;
const MAX_MESSAGE = 5000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Please submit the form again." },
        { status: 415 },
      );
    }

    const body = await request.json();
    // Honeypot field: bots often fill hidden fields. Return a generic success without processing.
    if (clean(body.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = clean(body.name, MAX_NAME);
    const email = clean(body.email, MAX_EMAIL).toLowerCase();
    const subject =
      clean(body.subject, MAX_SUBJECT) || "General business enquiry";
    const message = clean(body.message, MAX_MESSAGE);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }
    if (message.length < 10) {
      return NextResponse.json(
        {
          error:
            "Please provide a little more detail (at least 10 characters).",
        },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL || "innov5cafehub247@gmail.com";
    const sender =
      process.env.RESEND_FROM_EMAIL ||
      "INNOV5 GLOBAL HUB <onboarding@resend.dev>";

    if (!supabaseUrl || !supabaseKey || !resendKey) {
      console.error(
        "Contact API configuration is incomplete. Set Supabase URL/secret and Resend API key.",
      );
      return NextResponse.json(
        {
          error:
            "The enquiry service is not configured yet. Please contact us by email or WhatsApp.",
        },
        { status: 503 },
      );
    }

    const dbResponse = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/contact_enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ name, email, subject, message, status: "new" }),
        cache: "no-store",
      },
    );

    if (!dbResponse.ok) {
      console.error(
        "Supabase enquiry insert failed:",
        dbResponse.status,
        (await dbResponse.text()).slice(0, 500),
      );
      return NextResponse.json(
        {
          error:
            "We couldn't save your enquiry right now. Please try again or email us directly.",
        },
        { status: 502 },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `[Website enquiry] ${subject}`,
        text: `A new enquiry was submitted through the INNOV5 GLOBAL HUB website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      }),
      cache: "no-store",
    });

    if (!emailResponse.ok) {
      // The enquiry is safely saved in Supabase even if the notification email fails.
      console.error(
        "Resend notification failed:",
        emailResponse.status,
        (await emailResponse.text()).slice(0, 500),
      );
      return NextResponse.json({ success: true, notification: "saved" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 },
    );
  }
}
