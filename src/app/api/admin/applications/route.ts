import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function auth(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  if (!token || !url || !key || !secret || !admins.length)
    return {
      ok: false as const,
      status: 401,
      error: "Sign in with an authorised administrator account.",
    };
  const r = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const u = await r.json().catch(() => ({}));
  if (!r.ok || !u.email)
    return {
      ok: false as const,
      status: 401,
      error: "Your session has expired.",
    };
  if (!admins.includes(String(u.email).toLowerCase()))
    return {
      ok: false as const,
      status: 403,
      error: "Administrator access is required.",
    };
  return { ok: true as const, url: url.replace(/\/$/, ""), secret };
}
function esc(v: string) {
  return v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] || c,
  );
}
export async function GET(request: Request) {
  try {
    const a = await auth(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const r = await fetch(
      `${a.url}/rest/v1/career_applications?select=*&order=created_at.desc&limit=500`,
      {
        headers: { apikey: a.secret, Authorization: `Bearer ${a.secret}` },
        cache: "no-store",
      },
    );
    const d = await r.json().catch(() => []);
    if (!r.ok)
      return NextResponse.json(
        {
          error:
            "Could not load applications. Run the career applications migration.",
        },
        { status: 502 },
      );
    return NextResponse.json({ applications: d });
  } catch {
    return NextResponse.json(
      { error: "Unable to load applications." },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const a = await auth(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const b = await request.json();
    const id = Number(b.id);
    const status = String(b.status || "");
    const notes =
      typeof b.internal_notes === "string"
        ? b.internal_notes.slice(0, 5000)
        : undefined;
    if (
      !Number.isInteger(id) ||
      id < 1 ||
      ![
        "received",
        "reviewing",
        "shortlisted",
        "interview_invited",
        "rejected",
        "hired",
      ].includes(status)
    )
      return NextResponse.json(
        { error: "Invalid application update." },
        { status: 400 },
      );
    const patch: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) patch.internal_notes = notes;
    const r = await fetch(`${a.url}/rest/v1/career_applications?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: a.secret,
        Authorization: `Bearer ${a.secret}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(patch),
    });
    const d = await r.json().catch(() => []);
    if (!r.ok)
      return NextResponse.json(
        { error: "Could not update application status." },
        { status: 502 },
      );
    return NextResponse.json({ application: Array.isArray(d) ? d[0] : d });
  } catch {
    return NextResponse.json(
      { error: "Unable to update application." },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const a = await auth(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const b = await request.json();
    const id = Number(b.id);
    const subject = String(
      b.subject || "Interview invitation from INNOV5 GLOBAL HUB",
    )
      .trim()
      .slice(0, 180);
    const message = String(b.message || "")
      .trim()
      .slice(0, 6000);
    if (!Number.isInteger(id) || id < 1 || !message)
      return NextResponse.json(
        { error: "Choose an applicant and enter the invitation message." },
        { status: 400 },
      );
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL)
      return NextResponse.json(
        {
          error:
            "Email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in the deployment environment.",
        },
        { status: 503 },
      );
    const q = await fetch(
      `${a.url}/rest/v1/career_applications?id=eq.${id}&select=id,application_number,applicant_name,email,job_title&limit=1`,
      {
        headers: { apikey: a.secret, Authorization: `Bearer ${a.secret}` },
        cache: "no-store",
      },
    );
    const arr = await q.json().catch(() => []);
    const app = arr?.[0];
    if (!q.ok || !app)
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    const email = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [app.email],
        subject,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#14254b;max-width:640px;margin:auto"><h2 style="color:#175fd1">INNOV5 GLOBAL HUB</h2><p>Dear ${esc(app.applicant_name)},</p><p>${esc(message).replace(/\n/g, "<br>")}</p><hr><p><b>Application number:</b> ${esc(app.application_number)}<br><b>Position:</b> ${esc(app.job_title)}</p><p>Regards,<br>Recruitment Team<br>INNOV5 GLOBAL HUB</p></div>`,
      }),
    });
    const ed = await email.json().catch(() => ({}));
    if (!email.ok)
      return NextResponse.json(
        {
          error: ed.message || "Email provider could not send the invitation.",
        },
        { status: 502 },
      );
    await fetch(`${a.url}/rest/v1/career_applications?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: a.secret,
        Authorization: `Bearer ${a.secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "interview_invited",
        invitation_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${app.email}.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send invitation." },
      { status: 500 },
    );
  }
}
