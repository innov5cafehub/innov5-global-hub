import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorisedUser(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (
    !token ||
    !supabaseUrl ||
    !publishableKey ||
    !secretKey ||
    admins.length === 0
  ) {
    return {
      ok: false as const,
      status: 401,
      error: "Sign in with an authorised administrator account.",
    };
  }
  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`,
    {
      headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  const user = await response.json().catch(() => ({}));
  if (!response.ok || !user.email)
    return {
      ok: false as const,
      status: 401,
      error: "Your session has expired. Please sign in again.",
    };
  if (!admins.includes(String(user.email).toLowerCase()))
    return {
      ok: false as const,
      status: 403,
      error: "Administrator access is required.",
    };
  return {
    ok: true as const,
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    secretKey,
  };
}

export async function GET(request: Request) {
  try {
    const auth = await authorisedUser(request);
    if (!auth.ok)
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    const response = await fetch(
      `${auth.supabaseUrl}/rest/v1/contact_enquiries?select=id,name,email,subject,message,status,internal_notes,created_at,updated_at&order=created_at.desc&limit=500`,
      {
        headers: {
          apikey: auth.secretKey,
          Authorization: `Bearer ${auth.secretKey}`,
        },
        cache: "no-store",
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Admin enquiry fetch failed:", response.status, data);
      return NextResponse.json(
        {
          error:
            "Could not load enquiries. Check that the contact table migration has been run.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ enquiries: data });
  } catch (error) {
    console.error("Admin enquiry list error:", error);
    return NextResponse.json(
      { error: "Unable to load enquiries right now." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await authorisedUser(request);
    if (!auth.ok)
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = await request.json();
    const id = Number(body.id);
    const status = String(body.status || "");
    const internalNotes =
      typeof body.internal_notes === "string"
        ? body.internal_notes.slice(0, 5000)
        : "";
    if (
      !Number.isInteger(id) ||
      id < 1 ||
      !["new", "in_progress", "resolved", "spam"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid enquiry update." },
        { status: 400 },
      );
    }
    const response = await fetch(
      `${auth.supabaseUrl}/rest/v1/contact_enquiries?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: auth.secretKey,
          Authorization: `Bearer ${auth.secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status,
          internal_notes: internalNotes,
          updated_at: new Date().toISOString(),
        }),
        cache: "no-store",
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Admin enquiry update failed:", response.status, data);
      return NextResponse.json(
        {
          error: "Could not update this enquiry. Check the database migration.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({
      success: true,
      enquiry: Array.isArray(data) ? data[0] : data,
    });
  } catch (error) {
    console.error("Admin enquiry update error:", error);
    return NextResponse.json(
      { error: "Unable to update this enquiry right now." },
      { status: 500 },
    );
  }
}
