"use client";

import "../admin.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type App = {
  id: number;
  application_number: string;
  job_title: string;
  applicant_name: string;
  email: string;
  phone: string;
  qualification: string;
  cover_letter: string;
  resume_url: string;
  status: string;
  internal_notes: string;
  created_at: string;
  invitation_sent_at: string | null;
};

const statuses = [
  "received",
  "reviewing",
  "shortlisted",
  "interview_invited",
  "rejected",
  "hired",
];

function formatDate(value?: string | null) {
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

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

function readableStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default function ApplicationsPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [adminEmail, setAdminEmail] = useState("Administrator");
  const [items, setItems] = useState<App[]>([]);
  const [selected, setSelected] = useState<App | null>(null);
  const [status, setStatus] = useState("received");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [invite, setInvite] = useState(false);

  const [subject, setSubject] = useState(
    "Interview invitation from INNOV5 GLOBAL HUB",
  );

  const [message, setMessage] = useState(
    "Dear applicant,\n\nThank you for your application. We would like to invite you to an interview. Please reply to this email to confirm your availability.\n\nRegards,\nRecruitment Team",
  );

  const signOut = useCallback(() => {
    sessionStorage.removeItem("innov5_admin_token");
    sessionStorage.removeItem("innov5_admin_email");
    router.replace("/admin/login");
  }, [router]);

  const load = useCallback(
    async (currentToken: string) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/applications", {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          signOut();
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Unable to load applications.");
        }

        const applications: App[] = data.applications || [];

        setItems(applications);

        // Keep the selected applicant in sync with the refreshed records.
        setSelected((current) => {
          if (!current) return null;

          return (
            applications.find((item) => item.id === current.id) ?? null
          );
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load applications.",
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
    void load(storedToken);
  }, [router, load]);

  function choose(application: App) {
    setSelected(application);
    setStatus(application.status);
    setNotes(application.internal_notes || "");
    setNotice("");
    setError("");
    setInvite(false);
  }

  async function save() {
    if (!selected) return;

    if (!token) {
      setError("Your admin session is missing. Please sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selected.id,
          status,
          internal_notes: notes,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        signOut();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to update application.");
      }

      setNotice("Application updated successfully.");
      await load(token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update application.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendInvite() {
    if (!selected) return;

    if (!token) {
      setError("Your admin session is missing. Please sign in again.");
      return;
    }

    if (!subject.trim()) {
      setError("Enter an email subject.");
      return;
    }

    if (!message.trim()) {
      setError("Enter the invitation message.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selected.id,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        signOut();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to send invitation.");
      }

      setNotice(data.message || "Invitation email sent successfully.");
      setInvite(false);
      setStatus("interview_invited");

      await load(token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send invitation.",
      );
    } finally {
      setBusy(false);
    }
  }

  const visible = items.filter(
    (application) =>
      filter === "all" || application.status === filter,
  );

  return (
    <main className="admin-shell admin-dashboard-shell">
      <header className="admin-topbar">
        <a href="/admin/enquiries" className="admin-wordmark">
          <span className="admin-brand-small">I5</span>
          <span>
            INNOV5 <b>GLOBAL HUB</b>
            <small>Career Applications</small>
          </span>
        </a>

        <div className="admin-account">
          <a href="/admin/enquiries">Enquiries</a>
          <a href="/admin/content">Content Studio</a>
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
            <p className="admin-eyebrow">RECRUITMENT WORKSPACE</p>
            <h1>Career applications</h1>
            <p className="admin-muted">
              Review candidates, track decisions, and email interview
              invitations.
            </p>
          </div>

          <button
            className="admin-secondary-button"
            type="button"
            onClick={() => {
              if (token) void load(token);
            }}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="application-summary-grid">
          <article>
            <span>Total applications</span>
            <strong>{items.length}</strong>
          </article>

          <article>
            <span>New</span>
            <strong>
              {items.filter((item) => item.status === "received").length}
            </strong>
          </article>

          <article>
            <span>Shortlisted</span>
            <strong>
              {items.filter((item) => item.status === "shortlisted").length}
            </strong>
          </article>

          <article>
            <span>Interview invited</span>
            <strong>
              {
                items.filter(
                  (item) => item.status === "interview_invited",
                ).length
              }
            </strong>
          </article>
        </div>

        {error && <p className="admin-error">{error}</p>}
        {notice && <p className="admin-success">{notice}</p>}

        <div className="cms-tabs application-filters">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          {statuses.map((itemStatus) => (
            <button
              key={itemStatus}
              type="button"
              className={filter === itemStatus ? "active" : ""}
              onClick={() => setFilter(itemStatus)}
            >
              {readableStatus(itemStatus)}
            </button>
          ))}
        </div>

        <div className="cms-layout application-layout">
          <section className="cms-list admin-list-panel">
            <div className="admin-list-heading">
              <h2>Applicants</h2>
              <span>{visible.length} shown</span>
            </div>

            {loading ? (
              <p className="admin-empty">Loading applications…</p>
            ) : visible.length > 0 ? (
              visible.map((application) => (
                <button
                  className={`application-list-item ${
                    selected?.id === application.id ? "selected" : ""
                  }`}
                  key={application.id}
                  type="button"
                  onClick={() => choose(application)}
                >
                  <strong>{application.applicant_name}</strong>
                  <span>{application.job_title}</span>
                  <small>
                    {application.application_number} ·{" "}
                    {readableStatus(application.status)}
                  </small>
                  <small>{formatDate(application.created_at)}</small>
                </button>
              ))
            ) : (
              <p className="admin-empty">
                No applications in this view yet.
              </p>
            )}
          </section>

          <section className="cms-editor admin-detail-panel">
            {selected ? (
              <>
                <div className="admin-detail-heading">
                  <div>
                    <p className="admin-eyebrow">
                      {selected.application_number}
                    </p>
                    <h2>{selected.applicant_name}</h2>
                    <p className="admin-muted">{selected.job_title}</p>
                  </div>

                  <span className="application-status-chip">
                    {readableStatus(selected.status)}
                  </span>
                </div>

                <div className="application-detail-body">
                  <p>
                    <b>Email:</b>{" "}
                    <a href={`mailto:${selected.email}`}>
                      {selected.email}
                    </a>
                  </p>

                  <p>
                    <b>Phone:</b> {selected.phone || "Not provided"}
                  </p>

                  <p>
                    <b>Qualification / experience:</b>
                    <br />
                    {selected.qualification || "Not provided"}
                  </p>

                  <p>
                    <b>Cover letter:</b>
                  </p>

                  <div className="application-cover-letter">
                    {selected.cover_letter || "No cover letter provided."}
                  </div>

                  <p>
                    <b>CV / portfolio:</b>{" "}
                    {selected.resume_url ? (
                      <a
                        href={selected.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open applicant link ↗
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>

                  <p>
                    <b>Received:</b> {formatDateTime(selected.created_at)}
                  </p>

                  {selected.invitation_sent_at && (
                    <p>
                      <b>Invitation sent:</b>{" "}
                      {formatDateTime(selected.invitation_sent_at)}
                    </p>
                  )}
                </div>

                <div className="cms-form">
                  <label className="cms-field">
                    Application status
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      {statuses.map((itemStatus) => (
                        <option key={itemStatus} value={itemStatus}>
                          {readableStatus(itemStatus)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="cms-field">
                    Internal notes
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Private recruitment notes"
                    />
                  </label>

                  <button
                    className="admin-primary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => void save()}
                  >
                    {busy ? "Saving…" : "Save review"}
                  </button>

                  <button
                    className="admin-secondary-button"
                    type="button"
                    onClick={() => setInvite((current) => !current)}
                  >
                    {invite
                      ? "Cancel invitation"
                      : "✉ Compose interview invitation"}
                  </button>

                  {invite && (
                    <div className="career-invite-box">
                      <label className="cms-field">
                        Email subject
                        <input
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                        />
                      </label>

                      <label className="cms-field">
                        Invitation message
                        <textarea
                          rows={8}
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                        />
                      </label>

                      <p className="admin-footnote">
                        This sends an email to {selected.email} using your
                        configured Resend account.
                      </p>

                      <button
                        className="admin-primary-button"
                        type="button"
                        disabled={busy}
                        onClick={() => void sendInvite()}
                      >
                        {busy ? "Sending…" : "Send invitation email"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="admin-detail-empty">
                <div>✉</div>
                <h2>Select an application</h2>
                <p>
                  Choose an applicant to review their details, update their
                  status, add private notes, or send an interview invitation.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}