"use client";

import "../admin.css";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = hash.get("access_token");
    const type = hash.get("type");
    if (token && (!type || type === "recovery")) {
      setAccessToken(token);
      window.history.replaceState(null, "", window.location.pathname);
    } else
      setError(
        "This reset link is missing or invalid. Request a new password-reset email.",
      );
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!accessToken) {
      setError("Open the latest password-reset link from your email.");
      return;
    }
    if (password.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, password }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not update password.");
      setMessage(data.message || "Password updated.");
      setPassword("");
      setConfirmPassword("");
      window.setTimeout(() => router.replace("/admin/login"), 1800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update password.",
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
        <h1>Set a new password</h1>
        <p className="admin-muted">
          Choose a new password for your administrator account. Use at least 8
          characters.
        </p>
        <form onSubmit={submit} className="admin-form">
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <button
            className="admin-primary-button"
            disabled={busy || !accessToken}
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
        <p className="admin-footnote">
          If this link has expired, return to sign in and request another reset
          email.
        </p>
      </section>
    </main>
  );
}
