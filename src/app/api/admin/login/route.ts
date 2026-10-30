import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Enter your email and password." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const admins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    if (!supabaseUrl || !publishableKey || admins.length === 0) {
      console.error(
        "Admin login configuration incomplete. Check Supabase settings and ADMIN_EMAILS.",
      );
      return NextResponse.json(
        { error: "Administrator login is not configured yet." },
        { status: 503 },
      );
    }

    const authResponse = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: publishableKey },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        cache: "no-store",
      },
    );
    const session = await authResponse.json().catch(() => ({}));
    if (!authResponse.ok || !session.access_token || !session.user?.email) {
      return NextResponse.json(
        {
          error:
            "Sign-in failed. Check your credentials and email verification.",
        },
        { status: 401 },
      );
    }
    if (!admins.includes(String(session.user.email).toLowerCase())) {
      return NextResponse.json(
        { error: "This account is not authorised as a website administrator." },
        { status: 403 },
      );
    }
    return NextResponse.json({
      access_token: session.access_token,
      expires_in: session.expires_in,
      user: { email: session.user.email },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 },
    );
  }
}
