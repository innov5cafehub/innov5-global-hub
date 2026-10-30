import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { accessToken, password } = await request.json();
    if (
      typeof accessToken !== "string" ||
      !accessToken ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Use the reset link from your email and choose a password with at least 8 characters.",
        },
        { status: 400 },
      );
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey)
      return NextResponse.json(
        { error: "Password reset is not configured." },
        { status: 503 },
      );
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: publishableKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
        cache: "no-store",
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      return NextResponse.json(
        {
          error:
            data.msg ||
            data.message ||
            data.error_description ||
            "The reset link may have expired. Request a new one.",
        },
        { status: 400 },
      );
    return NextResponse.json({
      message:
        "Password updated successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      {
        error:
          "Unable to update the password right now. Please request a new reset link.",
      },
      { status: 500 },
    );
  }
}
