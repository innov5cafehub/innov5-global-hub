import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  if (kind !== "news" && kind !== "careers")
    return NextResponse.json(
      { error: "Choose news or careers." },
      { status: 400 },
    );
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ items: [] });
  const table = kind === "news" ? "news_articles" : "career_jobs";
  try {
    const r = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/${table}?select=*&status=eq.published&order=published_at.desc&limit=100`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );
    const data = await r.json().catch(() => []);
    if (!r.ok) return NextResponse.json({ items: [] });
    return NextResponse.json({ items: data });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
