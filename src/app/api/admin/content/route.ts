import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Kind = "news" | "careers";
const tables: Record<Kind, string> = {
  news: "news_articles",
  careers: "career_jobs",
};
async function authorize(request: Request) {
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
    .map((v) => v.trim().toLowerCase())
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
  const user = await r.json().catch(() => ({}));
  if (!r.ok || !user.email)
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
  return { ok: true as const, url: url.replace(/\/$/, ""), secret };
}
function kindFrom(request: Request): Kind | null {
  const k = new URL(request.url).searchParams.get("kind");
  return k === "news" || k === "careers" ? k : null;
}
export async function GET(request: Request) {
  try {
    const a = await authorize(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const kind = kindFrom(request);
    if (!kind)
      return NextResponse.json(
        { error: "Choose news or careers." },
        { status: 400 },
      );
    const r = await fetch(
      `${a.url}/rest/v1/${tables[kind]}?select=*&order=created_at.desc&limit=500`,
      {
        headers: { apikey: a.secret, Authorization: `Bearer ${a.secret}` },
        cache: "no-store",
      },
    );
    const data = await r.json().catch(() => []);
    if (!r.ok)
      return NextResponse.json(
        {
          error:
            "Could not load content. Run the content management SQL migration first.",
        },
        { status: 502 },
      );
    return NextResponse.json({ items: data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load content." },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const a = await authorize(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const kind = kindFrom(request);
    if (!kind)
      return NextResponse.json(
        { error: "Choose news or careers." },
        { status: 400 },
      );
    const b = await request.json();
    const title = String(b.title || "")
      .trim()
      .slice(0, 180);
    const slug = String(
      b.slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
    ).slice(0, 200);
    if (!title || !slug)
      return NextResponse.json(
        { error: "A title is required." },
        { status: 400 },
      );
    const base = {
      title,
      slug,
      summary: String(b.summary || "").slice(0, 500),
      body: String(b.body || "").slice(0, 30000),
      status:
        kind === "news"
          ? b.status === "published"
            ? "published"
            : b.status === "archived"
              ? "archived"
              : "draft"
          : b.status === "published"
            ? "published"
            : b.status === "closed"
              ? "closed"
              : b.status === "archived"
                ? "archived"
                : "draft",
      published_at:
        b.status === "published"
          ? b.published_at || new Date().toISOString()
          : null,
    };
    const row =
      kind === "news"
        ? {
            ...base,
            category: String(b.category || "Company News").slice(0, 80),
            author: String(b.author || "INNOV5 GLOBAL HUB").slice(0, 120),
            featured_image: String(b.featured_image || "").slice(0, 1000),
          }
        : {
            ...base,
            department: String(b.department || "").slice(0, 100),
            location: String(b.location || "Nigeria").slice(0, 150),
            employment_type: String(b.employment_type || "Full-time").slice(
              0,
              80,
            ),
            requirements: String(b.requirements || "").slice(0, 10000),
            deadline: b.deadline || null,
          };
    const r = await fetch(`${a.url}/rest/v1/${tables[kind]}`, {
      method: "POST",
      headers: {
        apikey: a.secret,
        Authorization: `Bearer ${a.secret}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok)
      return NextResponse.json(
        {
          error:
            data.message ||
            "Could not create this item. Check the migration and unique slug.",
        },
        { status: 502 },
      );
    return NextResponse.json(
      { item: Array.isArray(data) ? data[0] : data },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to save content." },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const a = await authorize(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const kind = kindFrom(request);
    if (!kind)
      return NextResponse.json(
        { error: "Choose news or careers." },
        { status: 400 },
      );
    const b = await request.json();
    const id = Number(b.id);
    if (!Number.isInteger(id) || id < 1)
      return NextResponse.json({ error: "Invalid item id." }, { status: 400 });
    const allowed = [
      "title",
      "slug",
      "summary",
      "body",
      "status",
      "published_at",
      ...(kind === "news"
        ? ["category", "author", "featured_image"]
        : [
            "department",
            "location",
            "employment_type",
            "requirements",
            "deadline",
          ]),
    ];
    const row: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    for (const k of allowed) if (b[k] !== undefined) row[k] = b[k];
    if (row.status === "published" && !row.published_at)
      row.published_at = new Date().toISOString();
    const r = await fetch(`${a.url}/rest/v1/${tables[kind]}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: a.secret,
        Authorization: `Bearer ${a.secret}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok)
      return NextResponse.json(
        { error: data.message || "Could not update item." },
        { status: 502 },
      );
    return NextResponse.json({ item: Array.isArray(data) ? data[0] : data });
  } catch {
    return NextResponse.json(
      { error: "Unable to update content." },
      { status: 500 },
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const a = await authorize(request);
    if (!a.ok)
      return NextResponse.json({ error: a.error }, { status: a.status });
    const kind = kindFrom(request);
    if (!kind)
      return NextResponse.json(
        { error: "Choose news or careers." },
        { status: 400 },
      );
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id < 1)
      return NextResponse.json({ error: "Invalid item id." }, { status: 400 });
    const r = await fetch(`${a.url}/rest/v1/${tables[kind]}?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: a.secret, Authorization: `Bearer ${a.secret}` },
    });
    if (!r.ok)
      return NextResponse.json(
        { error: "Could not delete item." },
        { status: 502 },
      );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete content." },
      { status: 500 },
    );
  }
}
