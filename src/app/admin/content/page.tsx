"use client";

import "../admin.css";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

type ContentKind = "news" | "careers";

type Item = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: string;
  created_at: string;
  category?: string;
  author?: string;
  featured_image?: string;
  department?: string;
  location?: string;
  employment_type?: string;
  requirements?: string;
  deadline?: string;
  published_at?: string;
};

type ContentForm = Record<string, string>;

const createEmptyForm = (): ContentForm => ({
  title: "",
  slug: "",
  summary: "",
  body: "",
  status: "draft",
  category: "Company News",
  author: "INNOV5 GLOBAL HUB",
  featured_image: "",
  department: "",
  location: "Nigeria",
  employment_type: "Full-time",
  requirements: "",
  deadline: "",
});

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function ContentManager() {
  const router = useRouter();

  const [kind, setKind] = useState<ContentKind>("news");
  const [token, setToken] = useState("");
  const [adminEmail, setAdminEmail] = useState("Administrator");
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<ContentForm>(createEmptyForm);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("innov5_admin_token");
    sessionStorage.removeItem("innov5_admin_email");
    router.replace("/admin/login");
  }, [router]);

  const load = useCallback(
    async (currentToken: string, currentKind: ContentKind) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/admin/content?kind=${currentKind}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          signOut();
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Unable to load content.");
        }

        setItems(data.items || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load content.",
        );
      } finally {
        setLoading(false);
      }
    },
    [signOut],
  );

  useEffect(() => {
    const storedToken = sessionStorage.getItem("innov5_admin_token");
    const storedEmail = sessionStorage.getItem("innov5_admin_email");

    if (storedEmail) {
      setAdminEmail(storedEmail);
    }

    if (!storedToken) {
      router.replace("/admin/login");
      return;
    }

    setToken(storedToken);

    const params = new URLSearchParams(window.location.search);
    const initialKind: ContentKind =
      params.get("kind") === "careers" ? "careers" : "news";

    setKind(initialKind);
    void load(storedToken, initialKind);
  }, [router, load]);

  function chooseKind(nextKind: ContentKind) {
    setKind(nextKind);
    setSelected(null);
    setForm(createEmptyForm());
    setError("");
    setNotice("");

    router.replace(`/admin/content?kind=${nextKind}`);

    if (token) {
      void load(token, nextKind);
    }
  }

  function edit(item: Item | null) {
    setSelected(item);
    setError("");
    setNotice("");

    if (!item) {
      setForm(createEmptyForm());
      return;
    }

    setForm({
      ...createEmptyForm(),
      title: item.title ?? "",
      slug: item.slug ?? "",
      summary: item.summary ?? "",
      body: item.body ?? "",
      status: item.status ?? "draft",
      category: item.category ?? "Company News",
      author: item.author ?? "INNOV5 GLOBAL HUB",
      featured_image: item.featured_image ?? "",
      department: item.department ?? "",
      location: item.location ?? "Nigeria",
      employment_type: item.employment_type ?? "Full-time",
      requirements: item.requirements ?? "",
      deadline: item.deadline ? item.deadline.slice(0, 10) : "",
    });
  }

  function change(key: string, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title" && !selected
        ? {
            slug: value
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError("Your admin session is missing. Please sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        ...(selected ? { id: selected.id } : {}),
      };

      const response = await fetch(`/api/admin/content?kind=${kind}`, {
        method: selected ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        signOut();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content.");
      }

      setNotice(selected ? "Changes saved successfully." : "Content created successfully.");
      setSelected(null);
      setForm(createEmptyForm());

      await load(token, kind);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save content.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    if (!token) {
      setError("Your admin session is missing. Please sign in again.");
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/content?kind=${kind}&id=${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        signOut();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete item.");
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id));

      if (selected?.id === item.id) {
        setSelected(null);
        setForm(createEmptyForm());
      }

      setNotice("Item deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete item.");
    }
  }

  function field(
    label: string,
    key: string,
    options?: {
      area?: boolean;
      type?: string;
      placeholder?: string;
    },
  ) {
    return (
      <label className="cms-field" key={key}>
        {label}

        {options?.area ? (
          <textarea
            rows={key === "body" ? 8 : 4}
            value={form[key] || ""}
            onChange={(event) => change(key, event.target.value)}
            placeholder={options.placeholder || label}
          />
        ) : (
          <input
            type={options?.type || "text"}
            value={form[key] || ""}
            onChange={(event) => change(key, event.target.value)}
            placeholder={options?.placeholder || label}
          />
        )}
      </label>
    );
  }

  return (
    <main className="admin-shell admin-dashboard-shell">
      <header className="admin-topbar">
        <a href="/admin/enquiries" className="admin-wordmark">
          <span className="admin-brand-small">I5</span>
          <span>
            INNOV5 <b>GLOBAL HUB</b>
            <small>Content Studio</small>
          </span>
        </a>

        <div className="admin-account">
          <a href="/admin/enquiries">Enquiries</a>
          <a href="/admin/applications">Applications</a>
          <span>{adminEmail}</span>
          <button
            onClick={signOut}
            className="admin-quiet-button"
            type="button"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">WEBSITE CONTENT</p>
            <h1>Content studio</h1>
            <p className="admin-muted">
              Create and manage news articles and career vacancies.
            </p>
          </div>

          <button
            className="admin-secondary-button"
            type="button"
            onClick={() => {
              if (token) void load(token, kind);
            }}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="cms-tabs">
          <button
            type="button"
            className={kind === "news" ? "active" : ""}
            onClick={() => chooseKind("news")}
          >
            ✦ News &amp; Insights
          </button>

          <button
            type="button"
            className={kind === "careers" ? "active" : ""}
            onClick={() => chooseKind("careers")}
          >
            ↗ Career vacancies
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}
        {notice && <p className="admin-success">{notice}</p>}

        <div className="cms-layout">
          <section className="cms-list admin-list-panel">
            <div className="admin-list-heading">
              <h2>{kind === "news" ? "Articles" : "Vacancies"}</h2>
              <span>{items.length} total</span>
            </div>

            <button
              className="admin-primary-button cms-new"
              type="button"
              onClick={() => edit(null)}
            >
              ＋ Create {kind === "news" ? "article" : "vacancy"}
            </button>

            {loading ? (
              <p className="admin-empty">Loading…</p>
            ) : items.length === 0 ? (
              <p className="admin-empty">
                Nothing here yet. Create your first{" "}
                {kind === "news" ? "article" : "vacancy"}.
              </p>
            ) : (
              items.map((item) => (
                <article className="cms-list-item" key={item.id}>
                  <button
                    className="cms-item-main"
                    type="button"
                    onClick={() => edit(item)}
                  >
                    <strong>{item.title}</strong>
                    <span>
                      {item.status} · {formatDate(item.created_at)}
                    </span>
                    <small>{item.summary}</small>
                  </button>

                  <button
                    className="cms-delete"
                    type="button"
                    onClick={() => void remove(item)}
                    aria-label={`Delete ${item.title}`}
                  >
                    Delete
                  </button>
                </article>
              ))
            )}
          </section>

          <section className="cms-editor admin-detail-panel">
            <div className="admin-detail-heading">
              <div>
                <p className="admin-eyebrow">
                  {selected ? `EDIT #${selected.id}` : "NEW CONTENT"}
                </p>
                <h2>
                  {selected
                    ? "Edit item"
                    : `Create ${kind === "news" ? "an article" : "a vacancy"}`}
                </h2>
              </div>

              <span
                className={`admin-status ${
                  form.status === "published"
                    ? "status-resolved"
                    : "status-in_progress"
                }`}
              >
                {form.status || "draft"}
              </span>
            </div>

            <form className="cms-form" onSubmit={save}>
              {field("Title *", "title")}
              {field("URL slug *", "slug")}
              {field("Short summary", "summary", { area: true })}
              {field("Full content / description", "body", { area: true })}

              {kind === "news" ? (
                <>
                  {field("Category", "category")}
                  {field("Author", "author")}
                  {field("Featured image URL (optional)", "featured_image")}
                </>
              ) : (
                <>
                  {field("Department", "department")}
                  {field("Location", "location")}
                  {field("Employment type", "employment_type")}
                  {field("Requirements", "requirements", { area: true })}
                  {field("Application deadline", "deadline", { type: "date" })}
                </>
              )}

              <label className="cms-field">
                Publication status
                <select
                  value={form.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  <option value="draft">Draft — not public</option>
                  <option value="published">Published</option>
                  {kind === "careers" ? (
                    <option value="closed">Closed</option>
                  ) : (
                    <option value="archived">Archived</option>
                  )}
                </select>
              </label>

              <div className="cms-actions">
                <button
                  className="admin-primary-button"
                  type="submit"
                  disabled={busy}
                >
                  {busy
                    ? "Saving…"
                    : selected
                      ? "Save changes"
                      : "Create content"}
                </button>

                {selected && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => edit(null)}
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <p className="admin-footnote">
                Drafts remain unpublished. Published items appear on the public
                Insights and Careers pages, provided the public pages use the
                same content source and publication rules. Applications are
                managed in the Applications workspace.
              </p>
            </form>
          </section>
        </div>

        <p className="admin-security-note">
          Administrator-only content tools · access is verified server-side.
        </p>
      </div>
    </main>
  );
}