import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Enter your administrator email address." },
        { status: 400 },
      );
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) {
      return NextResponse.json(
        {
          error:
            "Password reset is not configured. Check the Supabase environment settings.",
        },
        { status: 503 },
      );
    }
    const origin = new URL(request.url).origin;
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/auth/v1/recover?redirect_to=${encodeURIComponent(`${origin}/admin/reset-password`)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: publishableKey },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      console.error(
        "Supabase password recovery request failed:",
        response.status,
        details,
      );
      return NextResponse.json(
        {
          error:
            details.msg ||
            details.message ||
            "Supabase could not send the reset email. Check Auth email settings and allowed redirect URLs.",
        },
        { status: 400 },
      );
    }
    // Avoid revealing whether a particular email is registered.
    return NextResponse.json({
      message:
        "If this email belongs to an account, a password-reset email will be sent. Check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("Password recovery error:", error);
    return NextResponse.json(
      { error: "Unable to request a reset email right now. Please try again." },
      { status: 500 },
    );
  }
}
