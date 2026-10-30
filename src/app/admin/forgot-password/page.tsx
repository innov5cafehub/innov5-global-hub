"use client";

import "../admin.css";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not request password reset.");
      setMessage(data.message || "Check your email for the reset link.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not request password reset.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <a href="/admin/login" className="admin-back-link">
          ← Back to sign in
        </a>
        <div className="admin-brand-mark">I5</div>
        <p className="admin-eyebrow">INNOV5 GLOBAL HUB</p>
        <h1>Forgot password?</h1>
        <p className="admin-muted">
          Enter the email address for your administrator account. We’ll send a
          password-reset link if the account exists.
        </p>
        <form onSubmit={submit} className="admin-form">
          <label htmlFor="reset-email">Administrator email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="admin-success" role="status">
              {message}
            </p>
          )}
          <button className="admin-primary-button" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="admin-footnote">
          Check your inbox and spam folder. Reset links may expire; you can
          request another if needed.
        </p>
      </section>
    </main>
  );
}
