"use client";

import "../admin.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "spam";
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};
const statusLabels: Record<Enquiry["status"], string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  spam: "Spam",
};

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Enquiry["status"]>("new");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const signOut = useCallback(() => {
    sessionStorage.removeItem("innov5_admin_token");
    sessionStorage.removeItem("innov5_admin_email");
    router.replace("/admin/login");
  }, [router]);
  const load = useCallback(
    async (authToken: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/enquiries", {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: "no-store",
        });
        const data = await res.json();
        if (res.status === 401 || res.status === 403) {
          signOut();
          return;
        }
        if (!res.ok) throw new Error(data.error || "Failed to load enquiries.");
        setItems(data.enquiries || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load enquiries.");
      } finally {
        setLoading(false);
      }
    },
    [signOut],
  );

  useEffect(() => {
    const savedToken = sessionStorage.getItem("innov5_admin_token");
    const savedEmail =
      sessionStorage.getItem("innov5_admin_email") || "Administrator";
    if (!savedToken) {
      router.replace("/admin/login");
      return;
    }
    setToken(savedToken);
    setEmail(savedEmail);
    void load(savedToken);
  }, [router, load]);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (filter === "all" || item.status === filter) &&
          `${item.name} ${item.email} ${item.subject} ${item.message}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, filter, search],
  );
  const current = items.find((item) => item.id === selected) || null;
  useEffect(() => {
    if (current) {
      setNotes(current.internal_notes || "");
      setStatus(current.status);
    }
  }, [selected, current?.internal_notes, current?.status]);

  async function save() {
    if (!current || !token) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: current.id, status, internal_notes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save changes.");
      setItems((old) =>
        old.map((item) =>
          item.id === current.id
            ? {
                ...item,
                status,
                internal_notes: notes,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setNotice("Enquiry updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  const newCount = items.filter((x) => x.status === "new").length;
  const openCount = items.filter((x) => x.status === "in_progress").length;
  const resolvedCount = items.filter((x) => x.status === "resolved").length;

  return (
    <main className="admin-shell admin-dashboard-shell">
      <header className="admin-topbar">
        <a href="/" className="admin-wordmark">
          <span className="admin-brand-small">I5</span>
          <span>
            INNOV5 <b>GLOBAL HUB</b>
            <small>Administration</small>
          </span>
        </a>
        <div className="admin-account">
          <a href="/admin/content">Content Studio</a>
          <a href="/admin/applications">Applications</a>
          <span>{email}</span>
          <button onClick={signOut} className="admin-quiet-button">
            Sign out
          </button>
        </div>
      </header>
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">CONTROL CENTRE</p>
            <h1>Enquiry management</h1>
            <p className="admin-muted">
              Review website enquiries and keep track of follow-up.
            </p>
          </div>
          <button
            className="admin-secondary-button"
            onClick={() => load(token)}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>
        <section className="admin-stat-grid">
          <article className="admin-stat-card">
            <span>Total enquiries</span>
            <strong>{items.length}</strong>
            <small>All received messages</small>
          </article>
          <article className="admin-stat-card">
            <span>New</span>
            <strong>{newCount}</strong>
            <small>Awaiting review</small>
          </article>
          <article className="admin-stat-card">
            <span>In progress</span>
            <strong>{openCount}</strong>
            <small>Follow-up underway</small>
          </article>
          <article className="admin-stat-card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
            <small>Completed enquiries</small>
          </article>
        </section>
        {error && (
          <p className="admin-error admin-banner" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="admin-success admin-banner" role="status">
            {notice}
          </p>
        )}
        <section className="admin-workspace">
          <div className="admin-list-panel">
            <div className="admin-list-heading">
              <h2>Website enquiries</h2>
              <span>{filtered.length} shown</span>
            </div>
            <input
              className="admin-search"
              placeholder="Search name, email or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search enquiries"
            />
            <div className="admin-filter-row">
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            {loading ? (
              <p className="admin-empty">Loading enquiries…</p>
            ) : filtered.length === 0 ? (
              <p className="admin-empty">No enquiries match this view.</p>
            ) : (
              <div className="admin-enquiry-list">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    className={`admin-enquiry-item ${selected === item.id ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelected(item.id);
                      setNotice("");
                    }}
                  >
                    <div className="admin-item-top">
                      <strong>{item.name}</strong>
                      <span className={`admin-status status-${item.status}`}>
                        {statusLabels[item.status]}
                      </span>
                    </div>
                    <span className="admin-item-subject">{item.subject}</span>
                    <span className="admin-item-preview">{item.message}</span>
                    <span className="admin-item-date">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="admin-detail-panel">
            {!current ? (
              <div className="admin-detail-empty">
                <div>✉</div>
                <h2>Select an enquiry</h2>
                <p>
                  Choose a message from the list to review it and manage
                  follow-up.
                </p>
              </div>
            ) : (
              <>
                <div className="admin-detail-heading">
                  <div>
                    <p className="admin-eyebrow">ENQUIRY #{current.id}</p>
                    <h2>{current.subject}</h2>
                  </div>
                  <span className={`admin-status status-${current.status}`}>
                    {statusLabels[current.status]}
                  </span>
                </div>
                <div className="admin-sender">
                  <strong>{current.name}</strong>
                  <a href={`mailto:${current.email}`}>{current.email}</a>
                  <small>
                    Received {new Date(current.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="admin-message-body">{current.message}</div>
                <div className="admin-edit-fields">
                  <label htmlFor="enquiry-status">Update status</label>
                  <select
                    id="enquiry-status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as Enquiry["status"])
                    }
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="spam">Spam</option>
                  </select>
                  <label htmlFor="internal-notes">
                    Internal notes <span>(visible to administrators only)</span>
                  </label>
                  <textarea
                    id="internal-notes"
                    rows={5}
                    maxLength={5000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add follow-up notes…"
                  />
                  <button
                    className="admin-primary-button"
                    onClick={save}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <p className="admin-security-note">
          Protected administrator area · Enquiry data is requested through
          server-side access checks. Do not share your login credentials.
        </p>
      </div>
    </main>
  );
}
