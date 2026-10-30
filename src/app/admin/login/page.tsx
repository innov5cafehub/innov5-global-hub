"use client";

import "../admin.css";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      sessionStorage.setItem("innov5_admin_token", data.access_token);
      sessionStorage.setItem("innov5_admin_email", data.user.email);
      router.replace("/admin/enquiries");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <a href="/" className="admin-back-link">
          ← Back to website
        </a>
        <div className="admin-brand-mark">I5</div>
        <p className="admin-eyebrow">INNOV5 GLOBAL HUB</p>
        <h1>Administrator sign in</h1>
        <p className="admin-muted">
          Sign in with the authorised account you created in Supabase.
        </p>
        <form onSubmit={submit} className="admin-form">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p style={{ margin: "2px 0 8px", textAlign: "right", fontSize: 13 }}>
            <a
              href="/admin/forgot-password"
              style={{
                color: "#6555c8",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Forgot password?
            </a>
          </p>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <button className="admin-primary-button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
        <p className="admin-footnote">
          Access is restricted to email addresses configured in the server-side
          ADMIN_EMAILS setting.
        </p>
      </section>
    </main>
  );
}
